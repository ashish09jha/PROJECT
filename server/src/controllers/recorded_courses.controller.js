import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { recorded_courses } from "../models/recorded_courses.model.js";

const get_course = asyncHandler(async (req, res) => {
    try {
        const courses = await recorded_courses.find();
        res.status(200).json(new apiResponse(200, courses, "Course fetched successfully"));
    } catch (error) {
        throw new apiError(404, `Error: ${error.message}`);
    }
});

const create_course = asyncHandler(async (req, res) => {
    const { course, link, teacher } = req.body;

    console.log(req.files);
    const image_Path=req.files?.image[0]?.path
    if(!image_Path){
        throw new apiError(400,"image is required")
    }
    const course_image=await uploadOnCloudinary(image_Path) 
    if(!course_image){
        throw new apiError(400,"course_image is requied")
    }

    if (!(course && link)) {
        throw new apiError(404, "All fields required");
    }

    try {
        const data = new recorded_courses({
            course,
            link,
            teacher,
            image:course_image.url
        });
        const resp = await data.save();
        res.status(200).json(new apiResponse(200, resp, "Course created successfully"));
    } catch (error) {
        throw new apiError(404, `Error: ${error.message}`);
    }
});

export {
    get_course,
    create_course
};
