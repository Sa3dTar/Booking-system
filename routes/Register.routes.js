import express from 'express'
import { addUser , GetAllUSers, getSingleUSer , UpdateUser , deletUser} from '../controller/Auth/Register.controller.js'
import {userSchema} from '../middleware/validationSchema.js'
import upload from '../services/uploadImage.js'
import {VerifyAdminToken , VerifyUserToken , VerifyOwnerToken, VerifyToken} from '../middleware/verifyToken.js'
import { verify } from 'crypto'
import { rateLimiter } from '../middleware/RateLimits.js'

const router = express.Router()

router.route('/')
            .post(rateLimiter,userSchema ,upload.single('image') ,addUser)
            .get(rateLimiter,GetAllUSers)

router.route('/:id')
            .get(rateLimiter,getSingleUSer)
            .put( rateLimiter,VerifyToken,userSchema,UpdateUser)
            .delete(rateLimiter,VerifyToken, deletUser)

export default router