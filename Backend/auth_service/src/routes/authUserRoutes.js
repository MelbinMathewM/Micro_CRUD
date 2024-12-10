import express from 'express';
import { loginUser, registerUser, refreshToken as refreshUserToken } from '../controllers/userController.js';

const userRouter = express.Router();

// User Routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/refresh_token', refreshUserToken);


export default userRouter;
