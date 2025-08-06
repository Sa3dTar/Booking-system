import express from "express";
import { AddHotel, deleteHotel, GetAllHotels, GetSingleHotel, updateHotel } from "../controller/hotel.controller.js";
import upload from "../services/uploadImage.js";
import {VerifyOwnerToken} from '../middleware/verifyToken.js'
import { rateLimiter } from "../middleware/RateLimits.js";
import { hotelSchema } from "../middleware/validationSchema.js";
const router = express.Router()

router.route('/')
            .post(rateLimiter,hotelSchema,VerifyOwnerToken,upload.single('image'),AddHotel)
            .get(rateLimiter,GetAllHotels)



router.route('/:id')
             .get(rateLimiter,GetSingleHotel)
             .put(rateLimiter,VerifyOwnerToken , updateHotel)
             .delete(rateLimiter,VerifyOwnerToken , deleteHotel)

export default router 