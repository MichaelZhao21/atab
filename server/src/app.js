const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}/data?retryWrites=true&w=majority`;
let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());

app.get('/', async function (req, res, next) {
    await dbCheck();
    const collection = client.db(process.env.TODO_DB).collection(process.env.TODO_COLLECTION);
    const todo = await collection.find().toArray();
    res.send({ todo });
});

app.post('/', async function (req, res, next) {
    const data = req.body;
    if (data === null || data === undefined) {
        sendRes(res, 400, 'No data defined');
        return;
    }

    await dbCheck();
    const collection = client.db(process.env.TODO_DB).collection(process.env.TODO_COLLECTION);
    const dbRes = await collection.insertOne({
        id: data.id,
        name: data.name,
        description: data.description,
        priority: data.priority,
        due: data.due,
        tags: data.tags,
    });

    const settingsCollection = client
        .db(process.env.TODO_DB)
        .collection(process.env.SETTINGS_COLLECTION);
    await settingsCollection.updateOne(
        { name: 'todo' },
        { $set: { count: data.id } },
        { upsert: true }
    );

    if (dbRes.insertedCount !== 1) {
        sendRes(res, 500, 'Could not insert item into the database');
        return;
    }

    sendRes(res, 200, 'Successfully inserted data!');
});

app.post('/:id', async function (req, res, next) {
    const data = req.body;
    if (data === null || data === undefined) {
        sendRes(res, 400, 'No data defined');
        return;
    }

    await dbCheck();
    const collection = client.db(process.env.TODO_DB).collection(process.env.TODO_COLLECTION);
    const dbRes = await collection.updateOne(
        { id: Number(req.params.id) },
        {
            $set: {
                id: data.id,
                name: data.name,
                description: data.description,
                priority: data.priority,
                due: data.due,
                tags: data.tags,
            },
        }
    );

    if (dbRes.modifiedCount !== 1) sendRes(res, 500, 'Error updating data');
    else sendRes(res, 200, `Successfully edited item: ID ${req.params.id}`);
});

app.delete('/:id', async function (req, res, next) {
    await dbCheck();
    const collection = client.db(process.env.TODO_DB).collection(process.env.TODO_COLLECTION);
    const dbRes = await collection.deleteOne({ id: Number(req.params.id) });
    if (dbRes.deletedCount !== 1) sendRes(res, 500, 'Error deleting data');
    else sendRes(res, 200, `Successfully deleted item: ID ${req.params.id}`);
});

app.post('/done/:id', async function (req, res, next) {
    await dbCheck();
    const collection = client.db(process.env.TODO_DB).collection(process.env.TODO_COLLECTION);
    const doneCollection = client.db(process.env.TODO_DB).collection(process.env.DONE_COLLECTION);

    const data = await collection.findOneAndDelete({ id: Number(req.params.id) });
    if (!data.ok) {
        sendRes(res, 400, 'Invalid object ID');
        return;
    }

    const doneRes = await doneCollection.insertOne(data.value);
    if (doneRes.insertedCount !== 1) {
        collection.insertOne(data);
        sendRes(res, 500, 'Could not mark completion');
        return;
    }

    sendRes(res, 200, 'Successfully completed task!');
});

app.get('/settings', async function (req, res, next) {
    await dbCheck();
    const collection = client.db(process.env.TODO_DB).collection(process.env.SETTINGS_COLLECTION);
    const data = await collection.findOne({ name: 'todo' });
    res.send(data);
});

app.post('/settings', async function (req, res, next) {
    if (req.body.tags === undefined) {
        sendRes(res, 400, 'No tags defined');
        return;
    }

    await dbCheck();
    const collection = client.db(process.env.TODO_DB).collection(process.env.SETTINGS_COLLECTION);
    collection.updateOne({ name: 'todo' }, { $set: { tags: req.body.tags } });
    res.send({ status: 200, message: `Successfully updated todo tags!` });
});

const statusCodes = {
    200: 'Success',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
};

function sendRes(res, status, message) {
    res.status(status);
    res.send({
        status,
        statusMessage: `${status}: ${statusCodes[status]}`,
        info: message,
    });
}

async function dbCheck() {
    if (!client.isConnected()) return client.connect();
}

module.exports = app;
