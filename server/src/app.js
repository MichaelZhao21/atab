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
    res.send({ status: 200, message: `Successfully editied item` });
});

app.get('/settings', async function (req, res, next) {
    // { count, tags }
    res.send({ count: 0, tags: ['boba', 'school'] });
});

app.post('/settings', async function (req, res, next) {
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
