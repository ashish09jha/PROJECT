import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from "../utils/apiError.js"; 
import { apiResponse } from "../utils/apiResponse.js";
import { user } from '../models/login.model.js';
  
const inactive_users = asyncHandler(async (req, res) => {
    try {
        const inactiveUsers = await user.find({ status: false });

        res.status(200).json(new apiResponse(200, inactiveUsers, "Inactive Users Retrieved Successfully"));
    } catch (error) {
        throw new apiError(400, `Error: ${error.message}`);
    }
});

const activateUser = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params; 

        if (!userId) {
            throw new apiError(400, "User ID is required");
        }

        const updatedUser = await user.findByIdAndUpdate(
            userId,
            { status: true },
            { new: true }
        );

        if (!updatedUser) {
            throw new apiError(404, "User not found");
        }

        res.status(200).json(new apiResponse(200, updatedUser, "User status updated to active successfully"));
    } catch (error) {
        throw new apiError(400, `Error: ${error.message}`);
    }
});

export{
    inactive_users,
    activateUser,

}