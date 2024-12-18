import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        default : 'user'
    },
    refreshToken : {
        type : String,
        default : null
    }
},{ timestamps : true });

const User = mongoose.model('User',userSchema);

export default User;