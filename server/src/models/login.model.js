import mongoose from 'mongoose'

const user_Schema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{ 
        type:String,
        required:true,
    },
    loginAs: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        required: true,
    },
    status:{
        type:Boolean,
        default:false,
    }
},{timestamps:true})

export const user=mongoose.model("user",user_Schema)