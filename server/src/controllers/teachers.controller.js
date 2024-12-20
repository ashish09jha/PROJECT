import {asyncHandler} from '../utils/asyncHandler.js'
import {apiError} from "../utils/apiError.js" 
import {apiResponse} from "../utils/apiResponse.js"
import {teachers} from '../models/teachers.model.js'
import {income} from '../models/income.model.js'

const add_teacher = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, email, contact, course, fee } = req.body;
    if (!(name && email && contact && course && fee)) {
        throw new apiError(400, "All fields are required");
    }
     
    const currentDate = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[currentDate.getMonth()]; 
    const year = currentDate.getFullYear();

    if(!(month && year)){
        throw new apiError(404,"Month and year Required");
    }

    try{
        const data=new income({
            type:"teacher",
            income:fee,
            month:month,
            year:year,
        })
        await data.save();
    }catch(error){
        throw new apiError(400,`Error:${error.message}`);
    }

    try {
        const newteacher = new teachers({
            name,
            email,
            contact,
            course,
            fee,
        });

        const resp = await newteacher.save();
        res.status(201).json(new apiResponse(201, resp, "Applicant registered successfully"));
    } catch (error) {
        throw new apiError(500, `Error: ${error.message}`);
    }
});

const get_teacher=asyncHandler(async(req,res)=>{
    try{
        const page=parseInt(req.query.page)||1;
        const limit=parseInt(req.query.limlt)||10;
        const skip=(page-1)*limit;

        const allteachers=await teachers.find().skip(skip).limit(limit);
        const totalteachers=await teachers.countDocuments();
        const totalPages=Math.ceil(totalteachers/limit);

        const data={
            teachers:allteachers,
            totalteachers,
            totalPages,
            currentPage:page,
            limit
        }

        res.status(200).json(new apiResponse(200,data,"teachers fetched successfully"));

    }catch(error){
        throw new apiError(500,`Error:${error.message}`);
    }
});

const delete_teacher = asyncHandler(async (req, res) => {
    const { ids } = req.body; 

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new apiError(400, "IDs are required and must be an array");
    }

    try {
        const result = await teachers.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount === 0) {
            return res.status(404).json(new apiResponse(404, {}, "No teachers found with the given IDs"));
        }

        res.status(200).json(new apiResponse(200, { deletedCount: result.deletedCount }, "teachers deleted successfully"));
    } catch (error) {
        throw new apiError(500, `Error: ${error.message}`);
    }
});
const update_teacher = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, contact, course, fee } = req.body;

    if (!(name && email && contact && course && fee)) {
        throw new apiError(400, "All fields are required");
    }

    try {
        const updatedteacher = await teachers.findByIdAndUpdate(
            id,
            { name, email, contact, course, fee },
            { new: true, runValidators: true } 
        );

        if (!updatedteacher) {
            return res.status(404).json(new apiResponse(404, {}, "teacher not found"));
        }

        res.status(200).json(new apiResponse(200, updatedteacher, "teacher updated successfully"));
    } catch (error) {
        throw new apiError(500, `Error: ${error.message}`);
    }
});


export {
    add_teacher,
    get_teacher,
    delete_teacher,
    update_teacher
};