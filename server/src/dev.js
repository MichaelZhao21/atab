const app = require('./app');

// Use .env file
require('dotenv').config();

app.listen(process.env.PORT || 5000, () => {
    console.log(`Listening on port ${process.env.PORT || 5000}`);
});
