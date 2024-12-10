import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { publishMessage, sendNotification } from '../services/rabbitmqService.js';

export const refreshToken = async (req,res) => {
    
    try{
        const refreshToken = req.headers['authorization'].split(' ')[1];
        if(!refreshToken) return res.status(401).json({ error : 'Refresh token missing' });

        const isVerified = jwt.verify(refreshToken,process.env.USER_REFRESH_SECRET_TOKEN);
        if (!isVerified) return res.status(403).json({ error : 'Invalid token'})

        const payload = { userId : isVerified.userId, username : isVerified.username, role : isVerified.role };
        const newAccessToken = jwt.sign(payload,process.env.USER_ACCESS_SECRET_TOKEN, {expiresIn : '5m'});

        res.json({newAccessToken})
        
    }catch(err){
        console.log(err);
    }
}

export const registerUser = async (req,res) => {
    try{
        const { name, username, password, email } = req.body;

        const existing = await User.findOne({username});
        if (existing) return res.status(401).json({ message : 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = new User({
            name,
            username,
            email,
            password : hashedPassword
        });

        await user.save();
        const exchange = 'user-exchange';
        const routingKey = 'user.added';
        const event = {
            type : 'USER_ADDED',
            payload : { userId : user._id, name, username, email, hashedPassword }
        }
        publishMessage(exchange, routingKey, event);

        sendNotification('email',user.email,'Welcome to the service');

        res.status(201).json({ message : 'User created successfully' });

    }catch(err){
        console.log(err);
    }
};

export const loginUser = async (req,res) => {
    try{
        console.log(req.body)
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'Missing fields' });

        const user = await User.findOne({username});
        if(!user) return res.status(401).json({ message : 'User not found' });

        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) return res.status(401).json({ message : 'Incorrect password' });

        const payload = { userId : user._id, username : user.username, role : user.role };
        const accessToken = jwt.sign(payload,process.env.USER_ACCESS_SECRET_TOKEN, {expiresIn : '5m' });
        const refreshToken = jwt.sign(payload,process.env.USER_REFRESH_SECRET_TOKEN,{ expiresIn : '7d' });
        
        res.status(200).json({ accessToken, refreshToken, message : 'Login successfull' })
        console.log('kkk')
    }catch(err){
        res.status(500).json({ message: 'Error during login', error: err.message });
    }
}