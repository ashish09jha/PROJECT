import {asyncHandler} from '../utils/asyncHandler.js'
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {income} from "../models/income.model.js"
import {recorded_courses} from "../models/recorded_courses.model.js"
import {learners} from "../models/learners.model.js"
import {teachers} from "../models/teachers.model.js"
import moment from 'moment';

const get_income=asyncHandler(async(req,res)=>{
    const {year}=req.params;
    if(!(year)){
        throw new apiError(400,"Month and year is required");
    }
    try{
        const student_data=await income.find({type:"student",year:year});
        const teacher_data=await income.find({type:"teacher",year:year});

        try{
            const data={
                student_income:student_data,
                teacher_income:teacher_data,
            }

            res.status(200).json(new apiResponse(200,data,"Income send Successfully"));

        }catch(error){
            throw new apiError(400,`ERROR:${error.message}`)
        }

    }catch(error){
        throw new apiError(400,`ERROR:${error.message}`)
    }
})

const dashboard_details=asyncHandler(async(req,res)=>{ 
    
    try{
        const total_learners=await learners.countDocuments();
        const total_teachers=await teachers.countDocuments();
        const total_courses=await recorded_courses.countDocuments();
    
        const data={
            learners:total_learners,
            teachers:total_teachers,
            courses:total_courses
        }
          
        res.status(200).json(new apiResponse(200,data,"dashboard data send successfully"))
    }catch(error){
        throw new apiError(404,`error:${error.message}`);
    }
})

const days_span = asyncHandler(async (req, res) => {
    const { date } = req.params;
    if (!date) {
        throw new apiError(400, "Date is required");
    }

    try {
        const startDate = moment(date).subtract(6, 'days').startOf('day').toDate(); // 6 days ago + today
        const endDate = moment(date).endOf('day').toDate(); // End of today

        // Querying based on createdAt field
        const student_data = await income.find({
            type: "student",
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        });

        const teacher_data = await income.find({
            type: "teacher",
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        });

        const combinedData = [];
        for (let i = 0; i < 7; i++) {
            const day = moment(startDate).add(i, 'days').startOf('day').toDate();
            const student_income = student_data
                .filter(d => moment(d.createdAt).isSame(day, 'day'))
                .reduce((acc, curr) => acc + curr.income, 0);
            const teacher_income = teacher_data
                .filter(d => moment(d.createdAt).isSame(day, 'day'))
                .reduce((acc, curr) => acc + curr.income, 0);

            combinedData.push({
                x: i + 1,
                yval: student_income - teacher_income
            });
        }

        res.status(200).json(new apiResponse(200, combinedData, "Income for last 7 days sent successfully"));

    } catch (error) {
        throw new apiError(400, `ERROR: ${error.message}`);
    }
});

const recent_addition = asyncHandler(async (req, res) => {
    try {
        const startDate = moment().subtract(6, 'days').startOf('day').toDate(); 
        const endDate = moment().endOf('day').toDate();

        const recent_learners = await learners.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        });

        const recent_teachers = await teachers.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        });

        let recent_data = [...recent_learners, ...recent_teachers];
        console.log(recent_data);

        recent_data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json(new apiResponse(200, recent_data, "Recent additions of learners and teachers in the last 7 days sent successfully"));

    } catch (error) {
        throw new apiError(400, `ERROR: ${error.message}`);
    }
});

export {
    get_income,
    dashboard_details ,
    days_span,
    recent_addition
}