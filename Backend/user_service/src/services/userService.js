import User from "../models/userModel.js";
import grpc from '@grpc/grpc-js';
import jwt from 'jsonwebtoken';
import { publishMessage } from "./rabbitmqService.js";

export const GetUser = async (call,callback) => {
    const { user_id } = call.request;
    try{
        const user = await User.findById(user_id);
        if(!user){
            return callback({
                code : grpc.status.NOT_FOUND,
                message : "User not found"
            })
        }
        
        callback(null, {
            user : {
                user_id : user._id,
                name : user.name,
                username : user.username,
                email : user.email,
                role : user.role
            }
        })
    }catch(err){
        callback({
            code : grpc.status.INTERNAL,
            message : "Error fetching user"
        })
    }
}

export const EditUser = async (call,callback) => {

    try{
        const { user_id, user } = call.request;
        const { name, username, email} = user;
    const existingUserName = await User.findOne({ _id : { $ne : user_id }, username });
    const existingEmail = await User.findOne({ _id : { $ne : user_id }, email });
    if(existingUserName || existingEmail) return callback({
        code : grpc.status.ALREADY_EXISTS,
        message : "User already exists"
    })

    const userData = await User.findByIdAndUpdate(user_id, {
        $set : {
            name,
            username,
            email,
        }
    }, { new : true });
    if(!userData) return callback({
        code: grpc.status.NOT_FOUND,
        message : "User not found"
    })

    const exchange = 'user-exchange';
    const routingKey = 'user.added';
    const event = {
        type : 'USER_UPDATED',
        payload : {_id : user_id, name, username, email }
    }
    publishMessage(exchange, routingKey, event);

    callback(null,{
        user : {
            user_id : userData._id,
            name : userData.name,
            username : userData.username,
            email : userData.email,
            role : userData.role
        },
        message : "User updated successfully"
    })
    }catch(err){
        callback({
            code : grpc.status.INTERNAL,
            message : "Error fetching user"
        })
    }
}