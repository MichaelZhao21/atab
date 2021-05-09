// Use .env file
require('dotenv').config();

const app = require('./app');

app.listen(process.env.PORT || 5000, () => {
    console.log(`Listening on port ${process.env.PORT || 5000}`);
});
