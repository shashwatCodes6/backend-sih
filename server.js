import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import otpModel from './db/models/otpModel.js';
import User from './db/models/userModel.js';
import cors from 'cors'
import { userRouter } from './routes/user.routes.js';
import healthRouter from './routes/healthMetrics.route.js';

dotenv.config();


const { PORT, MongoURI , SMTP_PASS } = process.env;

const app = express();
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5173']
}))

mongoose.connect(MongoURI, {})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));


app.use('/api/user', userRouter)
app.use('/api/places', locationRouter)
app.use('/api/chatbot', chatbotRouter)


app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);
})