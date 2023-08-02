import express from 'express'
const app = express()
import 'express-async-errors'
import dotenv from 'dotenv'
dotenv.config()
import cloudinary from 'cloudinary'

// import cors from 'cors'
import { dbConnection } from './database/dbConnection.js'
import cookieParser from 'cookie-parser';
import morgan from 'morgan'
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import router from './routes/auth.js'
import userRouter from './routes/user.js'
import jobRouter from './routes/job.js'
import { authenticateUser } from './middleware/authMiddleware.js'
import {dirname} from 'path'
import { fileURLToPath } from 'url'
import path from 'path'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'


const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.resolve(__dirname , './public')))


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(helmet())
app.use(mongoSanitize())
app.use(cookieParser())
app.use(express.json())
// app.use(cors())
dbConnection()


app.use('/api/v2/auth' , router)
app.use('/api/v2/users' ,authenticateUser , userRouter)
app.use('/api/v2/jobs' ,  authenticateUser,jobRouter )

app.get('*' , (req,res) => {
    res.send(path.resolve(__dirname , './public' , 'index.html'))
})


app.get('/' , (req,res) => {
    res.send('Hello world')
})

app.get('/api/test' , (req,res) => {
    res.send('Hello wolrd dsds sd')
})


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const PORT = process.env.PORT || 3000
app.listen(PORT , () => console.log(`Server listening on ${PORT}`))
