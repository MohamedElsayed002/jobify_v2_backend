

import express from 'express'
import { login, register , logout } from '../controller/auth.controller.js'
import rateLimiter from 'express-rate-limit'

const apiLimiter = rateLimiter({
    windowMs : 15 * 60 * 1000,
    max : 30,
    message : {msg : 'IP rate limit exceeded,retry in 15 minutes'}
})

const router = express.Router()

router.post('/register',apiLimiter, register)
router.post('/login' ,apiLimiter, login)
router.get('/logout', logout)

export default router