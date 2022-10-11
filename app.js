require('dotenv').config();
const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.get('/', (req, res) => res.send('Donation Web API is running on Render'));

app.listen(port, () => {
    console.log(`Donation Web API listening on port ${port}`);
});
