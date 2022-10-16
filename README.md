# Web API for Teacher Supply Donation Web Application

## Get Started

After cloning the project, install the packages for the project

```
npm install
```

Set the environment variable in the `.env` file

```
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster1.hmltzxa.mongodb.net/DonationDB?retryWrites=true&w=majority
```
Replace `<username>` and `<password>` with your database credentials.
SESSION_SECRET is used for Express-Session

Run the server with nodemon

```
npm start
```
