import express from 'express';
import cors from 'cors';
import passport from 'passport';
import authRoutes from './routes/auth.route.js';
import teacherRoutes from './routes/teacher.route.js';
import supplyRoutes from './routes/supply.route.js';
import studentRoutes from './routes/student.route.js';
import donationRoutes from './routes/donation.route.js';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

const app = express();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(
    cors({
        origin: '*',
    })
);

app.use(passport.initialize());

//mount routes
app.use('/auth', authRoutes);
app.use('/', teacherRoutes);
app.use('/', supplyRoutes);
app.use('/', studentRoutes);
app.use('/', donationRoutes);

app.get('/', (req, res) =>
    res.status(200).send('Donation Web API is running on Render')
);

app.get('/ping', (req, res) => {
    const serverUp = { status: true };
    res.status(200).json(serverUp);
});

app.post('/sendEmail', (req, res) => {
    console.log('in sendEmail');
    let transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'tsdcapstone@gmail.com',
            pass: 'frlnvucfltrtkavq'
        }
    }));
    let mailOptions = {
        from: 'tsdcapstone@gmail.com',
        to: 'alicefisher100@gmail.com',
        subject: 'testing',
        text: 'test email'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.sendStatus(200);
        }
    })
});

export default app;
