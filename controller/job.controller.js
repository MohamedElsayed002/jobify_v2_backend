

import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request.js";
import { JobModel } from "../models/job.model.js";
import mongoose from 'mongoose'
import day from "dayjs";

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = new JobModel(req.body)
    if (!job) {
        throw new BadRequestError('something went wrong try again later')
    }
    await job.save()
    res.status(StatusCodes.CREATED).json({ job })
}


const allJobs = async (req, res) => {

    const { search , jobStatus , jobType , sort  } = req.query

    const queryObject = {
        createdBy: req.user.userId
    }


    if (search) {
        queryObject.$or = [
            { position: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
        ];
    }

    if(jobStatus && jobStatus !== 'all') {
        queryObject.jobStatus = jobStatus;
    }

    if(jobType && jobType !== 'all') {
        queryObject.jobType = jobType;
    }

    const sortOptions = {
        newest : '-createdAt',
        oldest : 'createdAt',
        'a-z' : 'position',
        'z-a' : '-position'
    }


    const sortKey = sortOptions[sort] || sortOptions.newest


    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1 ) * limit 



    const jobs = await JobModel.find(queryObject).sort(sortKey).limit(limit).skip(skip)

    const totalJobs = await  JobModel.countDocuments()
    const numOfPages = Math.ceil(totalJobs / limit )
    res.status(StatusCodes.OK).json({ totalJobs , numOfPages ,page, jobs })
}

const getSingleJob = async (req, res) => {
    let job = await JobModel.findOne({ _id: req.params.id })
    if (!job) {
        throw new BadRequestError(`Job not found ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({ job })
}


const updateJob = async (req, res) => {
    const { id } = req.params
    let newJob = await JobModel.findByIdAndUpdate({ _id: id }, req.body, { new: true })
    if (!newJob) {
        throw new BadRequestError(`job not found ${id}`)
    }
    res.status(StatusCodes.CREATED).json({ message: 'job modified', newJob })
}

const deleteJob = async (req, res) => {
    const { id } = req.params
    let deleteJob = await JobModel.findByIdAndDelete({ _id: id })
    if (!deleteJob) throw new BadRequestError(`Job not found ${id}`)
    res.status(StatusCodes.OK).json({ message: 'job deleted' })
}


const showStats = async (req, res) => {

    let stats = await JobModel.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
    ])

    stats = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr
        acc[title] = count
        return acc
    }, {})


    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0,
    }

    let monthlyApplications = await JobModel.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        {
            $group: {
                _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 }
    ])

    monthlyApplications = monthlyApplications.map((item) => {
        const { _id: { year, month }, count } = item
        const date = day().month(month - 1).year(year).format('MMM YY')
        return { date, count }
    }).reverse()



    res.status(200).json({ defaultStats, monthlyApplications })
}



export {
    createJob,
    allJobs,
    updateJob,
    getSingleJob,
    deleteJob,
    showStats
}