

import mongoose from "mongoose";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";

const JobSchema = mongoose.Schema({
    company: {
        type: String,
        required: [true, 'please enter a company name'],
    },
    position: {
        type: String,
        required: [true, 'please enter a position'],
    },
    jobStatus: {
        type: String,
        enum: Object.values(JOB_STATUS),
        default: JOB_STATUS.PENDING
    },
    jobType: {
        type: String,
        enum: Object.values(JOB_TYPE),
        default: JOB_TYPE.FULL_TIME
    },
    jobLocation : {
        type : String,
        required : [true, 'please enter a location'],
        default : 'my city'
    },
    createdBy : {
        type : mongoose.Types.ObjectId,
        ref : 'user'
    }
},{
    timestamps : true
})

export const JobModel = mongoose.model('job',JobSchema)