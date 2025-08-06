import express from "express";
import { AddRoom, deleteRoom, GetAllRoomsHotel, GetSingleRoom, UpdateRoom } from "../controller/room.controller.js";
import {VerifyOwnerToken} from '../middleware/verifyToken.js'
import {rateLimiter} from '../middleware/RateLimits.js'
import upload from "../services/uploadImage.js";
import asyncWrapper from "../middleware/asyncWrapper.js";
import { roomSchema } from "../middleware/validationSchema.js";

const router = express.Router()

router.route('/')
            .post(rateLimiter,roomSchema,upload.array('images', 7),VerifyOwnerToken,asyncWrapper(AddRoom))
            .get(rateLimiter,asyncWrapper(GetAllRoomsHotel))


router.route('/:id')
             .get(rateLimiter,asyncWrapper(GetSingleRoom))
             .put(rateLimiter, upload.any() , asyncWrapper(UpdateRoom) )
             .delete(rateLimiter , VerifyOwnerToken , asyncWrapper(deleteRoom) )
 
export default router