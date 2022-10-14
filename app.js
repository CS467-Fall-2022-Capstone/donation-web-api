'use strict'
import config from './src/config/config.js';
import app from './src/express.js';
import mongoose from 'mongoose';

const port = config.port || 3000;

//setup db
mongoose.Promise = global.Promise;

mongoose.connect(config.mongoUri).then(() => {
    console.log(`Connected to MongoDb at: ${config.mongoUri}`)
}).
    catch(error => {
        console.error(`Unable to establish connection to database: ${config.mongoUri}`);
    })

mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${config.mongoUri}`);
})

app.listen(port, (err) => {
    if (err) {
        console.log(err)
    }
    console.log(`Donation Web API listening on port ${port}`);
});
