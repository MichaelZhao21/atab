const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async function (req, res, next) {
    res.send({ todo: 'nothing' });
});

app.get('/tags', async function (req, res, next) {
    res.send([
        { char: 'S', text: 'school' },
        { char: 'C', text: 'coding' },
        { char: 'V', text: 'very cool' },
        { char: 'B', text: "bob's tag LMAO" },
        { char: 'A', text: 'animals' },
    ]);
});

app.post('/tags', async function (req, res, next) {
    res.send({ status: 200, message: `Successfully updated todo tags!` });
});

app.post('/', async function (req, res, next) {
    const data = req.body;
    if (data === null || data === undefined) {
        sendError(res, 400, 'No data defined');
        return;
    }

    console.log(data);
    res.send({ status: 200, message: `Successfully added a new item` });
});

app.post('/:id', async function (req, res, next) {
    const data = req.body;
    if (data === null || data === undefined) {
        sendError(res, 400, 'No data defined');
        return;
    }
    res.send({ status: 200, message: `Successfully editied item` });
});

const statusCodes = {
    200: 'Success',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
};

function sendError(res, status, message) {
    res.status(status);
    res.send({
        status,
        statusMessage: `${status}: ${statusCodes[status]}`,
        error: message,
    });
}

module.exports = app;
