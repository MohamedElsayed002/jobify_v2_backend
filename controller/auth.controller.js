

import {StatusCodes } from 'http-status-codes'
import { UserModel } from '../models/user.model.js'
import {UnauthenticatedError , BadRequestError} from '../errors/index.js'


const register = async (req,res) => {
    const email = req.body.email 
    let checkingEmail = await UserModel.findOne({email : email})
    if(checkingEmail) {
            throw new BadRequestError('email already exist')
    }
    const isFirstAccount = (await UserModel.countDocuments()) === 0
    req.body.role = isFirstAccount ? 'admin' : 'user'
    const user = new UserModel(req.body)
    await  user.save()
    res.status(StatusCodes.CREATED).json({message : 'user create' , user})
}

const login = async (req,res) => {
    const {email,password} = req.body
    if(!email || !password) {
        throw new BadRequestError('email and password are required')
    }
    const user = await UserModel.findOne({email : email})
    if(!user) {
        throw new BadRequestError('user not found')
    }
    const isMatch = await user.ComparePassword(password)
    if(!isMatch) {
        throw new BadRequestError('password not match')
    }
    const token = user.CreateJWT()
    let oneDay = 1000 * 60 * 60 * 24 

    res.cookie('token' , token , {
        httpOnly : true,
        expires : new Date(Date.now() + oneDay),
        secure : process.env.NODE_ENV === 'production'
    })

    res.status(StatusCodes.OK).json({message : 'login success'})
}

const logout = (req,res) => {
    res.cookie('token','logout',{
        httpOnly : true,
        expires : new Date(Date.now()),
    })

    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });

}



export {
    register,
    login,
    logout
}