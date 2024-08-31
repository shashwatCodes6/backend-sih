import express from 'express'
import { loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middleware/auth.middlware.js';


const userRouter = express.Router()


userRouter.post('/login', loginUser);
userRouter.post('/signup', registerUser);
userRouter.post('/logout', verifyJWT, logoutUser)



export {
    userRouter
}
