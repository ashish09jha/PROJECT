import mongoose from 'mongoose'

const todo_Schema=new mongoose.Schema({
    task:{
        type:String,
        required:true,
    },
    summary:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:["To Do","In Progress","Done"],
    }
},{timestamps:true})

export const todo=mongoose.model("todo",todo_Schema)