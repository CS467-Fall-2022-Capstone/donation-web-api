'use strict';
import config from './src/config/config.js';
import app from './src/express.js';
import mongoose from 'mongoose';

const port = config.port || 3000;

// Console log will output which DB type it is
// connected to based on development or production
// environment and hide the MongoDB Atlas
// connection string so username/password isn't exposed
let dbUri = "MongoDB Atlas"  // production environment is connected to Atlas
if (process.env.NODE_ENV === 'development') {
    dbUri = 'Local MongoDB Connection'
}

//setup db
mongoose
    .connect(config.mongoUri)
    .then(console.log(`Connected to DonationDB via ${dbUri}`))  
    .catch((error) => console.error(error));

const db = mongoose.connection;

// triggered on first request (one time event listener)
db.once('open', function () {
    console.log('Connected to DonationDB');
});

//handles errors AFTER initial connection
db.on('error', err => {
    console.error(`trouble connecting to the db`);
})

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Donation Web API listening on port ${port}`);
});
