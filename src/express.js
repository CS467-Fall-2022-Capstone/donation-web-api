import config from './config/config.js';
import express from 'express';
import cors from 'cors';
import teacherRoutes from './routes/teacher.route.js';
import Teacher from '../models/teacher.model.js';

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
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// configure passport for Auth
passport.use(Teacher.createStrategy());
passport.serializeUser(Teacher.serializeUser());
passport.deserializeUser(Teacher.deserializeUser());

//mount routes
app.use('/', teacherRoutes);

app.get('/', (req, res) =>
    res.status(200).send('Donation Web API is running on Render')
);

export default app;
