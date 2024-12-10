import express from 'express';
import { loginAdmin, refreshToken as refreshAdminToken } from '../controllers/adminController.js';

const adminRouter = express.Router();

// Admin Routes
adminRouter.post('/login', loginAdmin);
adminRouter.post('/refresh_token', refreshAdminToken);

export default adminRouter;