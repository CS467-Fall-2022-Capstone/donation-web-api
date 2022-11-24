import * as dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT,
    mongoUri: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_ALGO: process.env.JWT_ALGO,
    testMongoUri: process.env.MONGODB_URI,
};

export default config;
