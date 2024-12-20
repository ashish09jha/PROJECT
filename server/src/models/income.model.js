import mongoose from 'mongoose'

const income_Schema=new mongoose.Schema({
    type:{
        type:String,
        enum:["student","teacher"], 
        required:true,
    },
    income:{
        type:Number,
        required:true,
    },
    month:{ 
        type:String,
        required:true,
    },
    year:{ 
        type:String,
        required:true,
    },
},{timestamps:true})

export const income=mongoose.model("income",income_Schema)