import "dotenv/config.js";

const config = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGODB_URI
}

export default config;