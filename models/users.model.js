import mongoose from "mongoose";
import validator from 'validator';

const usersSchema = mongoose.Schema({
    Name : {
        type : String,
        required : true
    },
    email : {
        type :String,
        required : true,
        validator : [validator.isEmail , 'email format is wrong']
    },
    password :{
        type : String,
        required : true
    },
    phoneNumber : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['user' , 'owner', 'admin'],
        required : true
    },
    image : {
        type : String,
        required : true
    }
})

const users = mongoose.model('users', usersSchema)

export default users