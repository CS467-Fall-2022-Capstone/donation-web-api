require('dotenv').config();
const express = require('express');
const cors = require('cors');

const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);



app.get('/', (req, res) => {
    res.send('<h1>Donation Web API is running!</h1>');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
