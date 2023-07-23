


import express from 'express'
import { createJob , allJobs, updateJob , getSingleJob,showStats  , deleteJob} from '../controller/job.controller.js'
import { checkForTestUser } from '../middleware/authMiddleware.js'

const jobRouter = express.Router()


jobRouter.route('/').post(checkForTestUser,createJob).get(allJobs)
jobRouter.route('/stats').get(showStats)
jobRouter.route('/:id').patch(checkForTestUser,updateJob).get(getSingleJob).delete(checkForTestUser,deleteJob)




export default jobRouter