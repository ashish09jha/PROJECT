import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { LiveClass } from "../models/liveCourses.model.js";

// Get all live classes
const get_live_classes = asyncHandler(async (req, res) => {
    try {
        const liveClasses = await LiveClass.find();
        res.status(200).json(new apiResponse(200, liveClasses, "Live classes fetched successfully"));
    } catch (error) {
        throw new apiError(404, `Error: ${error.message}`);
    }
});

// Create a new live class
const create_live_class = asyncHandler(async (req, res) => {
    const { meetLink, StartTime, EndTime, Course } = req.body;

    // Handle file upload
    const image_Path = req.files?.thumbnail[0]?.path;
    if (!image_Path) {
        throw new apiError(400, "Thumbnail image is required");
    }

    const thumbnail_image = await uploadOnCloudinary(image_Path);
    if (!thumbnail_image) {
        throw new apiError(400, "Thumbnail upload failed");
    }

    if (!(meetLink && StartTime && EndTime && Course)) {
        throw new apiError(404, "All fields are required");
    }

    try {
        const newLiveClass = new LiveClass({
            meetLink,
            StartTime,
            EndTime,
            Course,
            thumbnail: thumbnail_image.url
        });
        const resp = await newLiveClass.save();
        res.status(200).json(new apiResponse(200, resp, "Live class created successfully"));
    } catch (error) {
        throw new apiError(404, `Error: ${error.message}`);
    }
});

const delete_live_class = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find the live class by ID
    const liveClass = await LiveClass.findById(id);
    if (!liveClass) {
        throw new apiError(404, "Live class not found");
    }

    // Delete the live class
    await liveClass.remove();
    res.status(200).json(new apiResponse(200, null, "Live class deleted successfully"));
});

export {
    get_live_classes,
    create_live_class,
    delete_live_class // Export the delete controller
};
