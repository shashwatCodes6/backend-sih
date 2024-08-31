import express from 'express'
import { loginUser, optSend } from '../controllers/user.controller.js';


const userRouter = express.Router()


userRouter.post('/login', loginUser);
userRouter.post('/sendOtp', optSend);



export {
    userRouter
}

