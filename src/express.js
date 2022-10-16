import express from 'express';
import cors from 'cors';
import passport from 'passport';
import authRoutes from './routes/auth.route.js'
import teacherRoutes from './routes/teacher.route.js';

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


app.get('/', (req, res) =>
    res.status(200).send('Donation Web API is running on Render')
);

export default app;
