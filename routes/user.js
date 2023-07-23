


import express from 'express'
import { getCurrentUser , getApplicationStats , updateUser} from '../controller/user.controller.js'
import { authenticateUser, checkForTestUser } from '../middleware/authMiddleware.js'
import upload from '../middleware/multer.js'



const userRouter = express.Router()


userRouter.get('/getCurrent'  , getCurrentUser )
userRouter.get('/getApplication' , getApplicationStats )
userRouter.patch('/update-user' ,checkForTestUser, upload.single('avatar') , updateUser)


export default userRouter