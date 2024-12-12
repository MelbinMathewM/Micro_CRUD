import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { publishMessage, sendNotification } from "../services/rabbitmqService.js";

export const getAdmin = async (req,res) => {
    try{

        const accessToken = req.headers['authorization']?.split(' ')[1];
        if(!accessToken) return res.status(401).json({ error : 'Access token missing' });
        
        const isVerified = jwt.verify(accessToken,process.env.ADMIN_ACCESS_SECRET_TOKEN);
        if(!isVerified) return res.status(401).json({ error : 'Invalid token' });

        const admin = await Admin.findById(isVerified.admin_id);
        if(!admin) return res.status(401).json({ message : 'Admin not found'});

        res.json({admin})

    }catch(err){
        console.log(err);
    }
}

export const getUsers = async (req,res) => {
    try{

        const users = await User.find();
        res.json({users});

    }catch(err){
        console.log(err);
    }
}

export const addUser = async (req,res) => {
    try {
        
        const { name, username, email, password } = req.body;

        const existingUsername = await User.findOne({username});
        if(existingUsername) return res.status(409).json({ message : 'Username already exists' });
        
        const existingEmail = await User.findOne({email});
        if(existingEmail) return res.status(409).json({ message : 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password,10);

        const user = new User({
            name,
            username,
            email,
            password : hashedPassword
        })
        const newUser = await user.save();

        const exchange = 'user-exchange';
        const routingKey = 'user.added';
        const event = {
            type : 'USER_ADDED',
            payload : { userId : user._id, name, username, email, hashedPassword }
        }
        publishMessage(exchange, routingKey, event);
        sendNotification('email',newUser.email,'Welcome to the service');

        res.status(200).json({ newUser,message : 'User added successfully'})
    }catch(err){
        console.log(err)
    }
}

export const editUser = async (req,res) => {
    try{

        const { id, name, username, email } = req.body;

        const existingUserName = await User.findOne({ _id : { $ne : id }, username});
        const existingEmail = await User.findOne({ _id : { $ne : id }, email});

        if(existingUserName) return res.status(409).json({ message : 'Username already exists' });
        if(existingEmail) return res.status(409).json({ message : 'Email already exists' });

        const updatedUser = await User.findByIdAndUpdate({_id : id},{ $set : {
            name,
            username,
            email
        }});

        const exchange = 'user-exchange';
        const routingKey = 'user.added';
        const event = {
            type : 'USER_UPDATED',
            payload : { _id : id , name, username, email }
        }
        publishMessage(exchange, routingKey, event);

        res.status(200).json({message : 'User updated successfully'})

    }catch(err){
        console.log(err);
    }
}

export const deleteUser = async (req,res) => {
    try{
        
        const { userId } = req.query;

        await User.deleteOne({ _id : userId });

        const exchange = 'user-exchange';
        const routingKey = 'user.added';
        const event = {
            type : 'USER_DELETED',
            payload : { userId }
        }
        publishMessage(exchange, routingKey, event);

        res.json({ message : 'User deleted' })
    }catch(err){
        console.log(err)
    }
}