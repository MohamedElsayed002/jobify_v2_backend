

import {StatusCodes} from 'http-status-codes'
import { UserModel } from '../models/user.model.js'
import { JobModel } from '../models/job.model.js'
import BadRequestError from '../errors/bad-request.js'
import cloudinary from 'cloudinary'
import {promises as fs} from 'fs'


const getCurrentUser = async (req,res) => {
    const user = await UserModel.findOne({_id : req.user.userId}).select('-password')
    res.status(StatusCodes.OK).json({user})
}

const getApplicationStats  = async (req,res) => {
    const users = await UserModel.countDocuments()
    const jobs = await JobModel.countDocuments()
    console.log(users,jobs)
    res.status(StatusCodes.OK).json({users , jobs})
}


const updateUser = async (req,res) => {
    const newUser = {...req.body}
    if(req.file) {
        const response = await cloudinary.v2.uploader.upload(req.file.path)
        await fs.unlink(req.file.path)
        newUser.avatar = response.secure_url
        newUser.avatarPublicId = response.public_id
    }
    const updateUser = await UserModel.findByIdAndUpdate(req.user.userId , newUser)


    if(req.file && updateUser.avatarPublicId) {
        await cloudinary.v2.uploader.destroy(updateUser.avatarPublicId)
    }
    res.status(StatusCodes.OK).json({message : 'update user'})
}

export {
    getCurrentUser,
    getApplicationStats,
    updateUser
}