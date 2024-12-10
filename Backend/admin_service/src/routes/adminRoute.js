import express from 'express';
import { getAdmin, getUsers, addUser, editUser, deleteUser } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.get('/dashboard',getAdmin);
adminRouter.get('/users',getUsers);
adminRouter.post('/verify_token',(req,res) => res.sendStatus(200));
adminRouter.post('/insert',addUser);
adminRouter.put('/update',editUser);
adminRouter.delete('/remove',deleteUser);

export default adminRouter;