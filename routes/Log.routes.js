import express from 'express'
import {userSchema} from '../middleware/validationSchema.js'
import { Login } from '../controller/Auth/Login.controller.js'
import upload from '../services/uploadImage.js'
import rateLimit from 'express-rate-limit'
import { rateLimiter } from '../middleware/RateLimits.js'


const router = express.Router()


router.route('/')
            .post(rateLimiter,userSchema,upload.none(),Login)


export default router