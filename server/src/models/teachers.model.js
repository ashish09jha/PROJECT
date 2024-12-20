import mongoose from "mongoose"

const teachers_schema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true, 
    },
    contact:{
        type:Number,
        requireed:true,
    },
    course:{
        type:String,
        required:true,
    },
    fee:{
        type:Number,
        required:true,
    }
},{timestamps:true})

export const teachers = mongoose.model("teachers",teachers_schema)