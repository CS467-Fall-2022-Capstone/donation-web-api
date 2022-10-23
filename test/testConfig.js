import mongoose from 'mongoose';
import config from '../src/config/config.js';

let setupDb = () => {
    before((done) => {
        // runs before the first test case
        mongoose
            .connect(config.testMongoUri)
            .then(console.log('Connecting to TestDB'))
            .catch((error) => console.error(error)); // connection to the data base
        const db = mongoose.connection;
        db.once('open', () => done()).on('error', (error) => done(error));
    });
    beforeEach((done) => {
        // runs before each test case
        mongoose.connection.db
            .listCollections({ name: 'teachers' })
            .next((error, collection) => {
                //deleting the collection before each
                if (collection) {
                    //test case to avoid duplicated key error
                    mongoose.connection.db
                        .dropCollection('teachers')
                        .then(() => done())
                        .catch((err) => done(err));
                } else {
                    done(error);
                }
            });
    });

    after((done) => {
        // runs after the last test case
        mongoose
            .disconnect()
            .then(() => done())
            .catch((err) => done(err));
    });
};

export default setupDb;
