import express from 'express';
import cors from 'cors';
import teacherRoutes from './routes/teacher.route.js';

const app = express();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cors());

//mount routes
app.use('/', teacherRoutes);

app.get('/', (req, res) => res.status(200).send('Donation Web API is running on Render'));

export default app;