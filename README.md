# Web API for Teacher Supply Donation Web Application

## Get Started

After cloning or forking the project, install the packages for the project

```
npm install
```

Set the environment variables in the `.env` file

```
PORT=3000  # For local development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster1.hmltzxa.mongodb.net/DonationDB?retryWrites=true&w=majority
JWT_SECRET=<Your Secret>
JWT_ALGO=<Your Algo>
TSD_EMAIL_PASS=<Your email account password>
```
Replace `<username>` and `<password>` in the `MONGODB_URI` string with your database credentials.
If you want to use a local version of MongoDB then replaec the string with `mongodb://localhost:27017/<dbname>`

**Run the server with nodemon**

```
npm start
```

## Testing

The unit and integration tests were written with mocha, chai, and supertest.

**To run the test suite**

```
npm test
```
