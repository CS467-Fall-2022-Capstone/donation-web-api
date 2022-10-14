'use strict';
import config from './src/config/config.js';
import app from './src/express.js';
import mongoose from 'mongoose';

const port = config.port || 3000;

//setup db
mongoose
    .connect(config.mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch((error) => console.error(error));

const db = mongoose.connection;

db.once('open', function () {
    console.log('Connected to DonationDB');
});

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Donation Web API listening on port ${port}`);
});
