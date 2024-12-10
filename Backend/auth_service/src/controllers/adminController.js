import Admin from '../models/adminModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const refreshToken = async (req,res) => {
    
    try{
        const refreshToken = req.headers['authorization'].split(' ')[1];
        if(!refreshToken) return res.status(401).json({ error : 'Refresh token missing' });

        const isVerified = jwt.verify(refreshToken,process.env.ADMIN_REFRESH_SECRET_TOKEN);
        if (!isVerified) return res.status(403).json({ error : 'Invalid token'})

        const payload = { admin_id : isVerified.admin_id, role : isVerified.role };
        const newAccessToken = jwt.sign(payload,process.env.ADMIN_ACCESS_SECRET_TOKEN, {expiresIn : '5m'});

        res.json({accessToken : newAccessToken})
        
    }catch(err){
        console.log(err);
    }
}

export const loginAdmin = async (req, res) => {
    try{

        const { email, password } = req.body; 

        const admin = await Admin.findOne({email});
        if (!admin) return res.status(401).json({ message : 'Admin not found' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message : 'incorrect password' });

        const payload = { admin_id : admin._id, role : admin.role };
        const accessToken = jwt.sign(payload,process.env.ADMIN_ACCESS_SECRET_TOKEN, { expiresIn : '5m' });
        const refreshToken = jwt.sign(payload,process.env.ADMIN_REFRESH_SECRET_TOKEN, { expiresIn : '7d' });

        res.json({ accessToken, refreshToken });

    }catch(err){
        console.log(err)
    }
}