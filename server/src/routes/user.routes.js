import {Router} from 'express'
import {upload} from "../middlewares/multer.middleware.js"

import {add_learners} from '../controllers/learners.controllers.js'
import {get_learners} from '../controllers/learners.controllers.js'
import {delete_learners} from '../controllers/learners.controllers.js'
import {update_learner } from '../controllers/learners.controllers.js'

import {add_teacher} from '../controllers/teachers.controller.js'
import {get_teacher} from '../controllers/teachers.controller.js'
import {delete_teacher} from '../controllers/teachers.controller.js'
import {update_teacher} from '../controllers/teachers.controller.js'

import {login_user} from '../controllers/login.controller.js'
import {signUp_user} from '../controllers/login.controller.js'
// import {logOut_user} from '../controllers/login.controller.js'

import {get_income} from "../controllers/dashboard.controller.js"  
import {days_span} from '../controllers/dashboard.controller.js'
import {dashboard_details} from "../controllers/dashboard.controller.js" 
import {recent_addition} from "../controllers/dashboard.controller.js" 

import {get_course} from "../controllers/recorded_courses.controller.js"
import {create_course} from "../controllers/recorded_courses.controller.js"

import { create_live_class} from '../controllers/live_courses.controller.js'
import { get_live_classes } from '../controllers/live_courses.controller.js'
import {delete_live_class} from '../controllers/live_courses.controller.js'

import { get_all_todos } from '../controllers/todo.controllers.js';
import { create_todo } from '../controllers/todo.controllers.js';
import { update_todo } from '../controllers/todo.controllers.js';
import { delete_todo } from '../controllers/todo.controllers.js';


const router =Router()

router.route('/learner').post(add_learners) 
router.route('/learner').get(get_learners)
router.route('/learner').delete(delete_learners)
router.route('/learner/:id').put(update_learner);

router.route('/teacher').post(add_teacher)
router.route('/teacher').get(get_teacher)
router.route('/teacher').delete(delete_teacher)
router.route('/teacher/:id').put(update_teacher);

router.route('/income/:year').get(get_income)
router.route('/days/:date').get(days_span)
router.route('/dashboard').get(dashboard_details)
router.route('/recent').get(recent_addition)

router.route('/login').post(login_user)
router.route('/signUp').post(signUp_user)
// router.route('/logOut').post(logOut_user)

router.route('/courses').get(get_course)
router.route('/courses').post(upload.fields([
    {
        name:"image",
        maxCount:1
    }
])
,create_course) 

router.route('/livecourses').get(get_live_classes)
router.route('/livecourses').post(upload.fields([
    {
        name:"thumbnail",
        maxCount:1
    }
])
,create_live_class) 
router.route('/livecourses/:id').delete(delete_live_class);

router.get('/todos', get_all_todos);
router.post('/todos', create_todo);
router.put('/todos/:id', update_todo);
router.delete('/todos/:id', delete_todo);

export default router