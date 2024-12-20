import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from "../utils/apiError.js"; 
import { apiResponse } from "../utils/apiResponse.js";
import { user } from '../models/login.model.js';
import {teachers} from '../models/teachers.model.js';
import { learners } from '../models/learners.model.js';

const signUp_user = asyncHandler(async (req, res) => {
    try {
        const { name, email, password, loginAs } = req.body;
        console.log(req.body);

        if (!(name && email && password && loginAs)) {
            throw new apiError(400, "All fields (name, email, password, loginAs) are required");
        }

        if (typeof email !== 'string' || !email.includes('@')) {
            throw new apiError(400, "Invalid email format");
        }

        const existingUser = await user.findOne({ email });
        if (existingUser) {
            console.log(existingUser);
            return res.status(500).json(new apiResponse(500,{}, "User already exists"));
        }

        let existingRoleUser;
        if (loginAs === 'student') {
            existingRoleUser = await learners.findOne({ email });
            if (existingRoleUser) {
                const newUser = new user({
                    name,
                    email,
                    password, 
                    loginAs,
                    status: true, 
                });
                const resp = await newUser.save();
                return res.status(200).json(new apiResponse(200, resp, "User Created Successfully"));
            } 
        } else if (loginAs === 'teacher') {
            existingRoleUser = await teachers.findOne({ email });
            if (existingRoleUser) {
                const newUser = new user({
                    name,
                    email,
                    password, 
                    loginAs,
                    status: true, 
                });
                const resp = await newUser.save();
                return res.status(200).json(new apiResponse(200, resp, "User Created Successfully"));
            }
        }

        // const newUser = new user({
        //     name,
        //     email,
        //     password, 
        //     loginAs,
        //     status: false, 
        // });

        const resp = await newUser.save();
        res.status(200).json(new apiResponse(200, resp, "User Created Successfully"));
    } catch (error) {
        throw new apiError(400, `Error: ${error.message}`);
    }
});


const login_user = asyncHandler(async (req, res) => {
    try {
        const { email, password, loginAs } = req.body; 
        if (!(email && password && loginAs)) {
            throw new apiError(400, "All fields (email, password, loginAs) are required");
        }

        if (typeof email !== 'string' || !email.includes('@')) {
            throw new apiError(400, "Invalid email format");
        }

        const resp = await user.findOne({ email, password, loginAs });

        if (!resp) {
            throw new apiResponse(400, "No user found with these credentials or role");
        }

        res.status(200).json(new apiResponse(200, resp, "Login Successfully"));
    } catch (error) {
        throw new apiError(400, `Error: ${error.message}`);
    }
});

 
// Logout User
// const logOut_user = asyncHandler(async (req, res, next) => {
//     try {
//         const { _id } = req.body;

//         if (!_id) {
//             throw new apiError(400, "User ID is required");
//         }

//         const resp = await user.findByIdAndUpdate(
//             _id, 
//             { logout: true }, 
//             { new: true }
//         );

//         if (!resp) {
//             throw new apiError(404, "User not found");
//         }

//         res.status(200).json(new apiResponse(200, resp, "Logout Successfully"));
//     } catch (error) {
//         next(error);
//     }
// });

export {
    login_user,
    signUp_user,
    // logOut_user
};
