import mongoose from "mongoose"

const liveClassSchema = new mongoose.Schema({
    meetLink: {
        type: String,
        required: true,
    },
    StartTime: {
        type: Date,
        required: true,
    },
    EndTime: {
        type: Date,
        required: true,
    },
    Course: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export const LiveClass = mongoose.model("LiveClass",liveClassSchema)
