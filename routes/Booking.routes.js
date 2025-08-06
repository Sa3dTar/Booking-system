import express from "express";
import { AddBookingAndPay, DeleteBooking, GetSingleBooking, UpdateBooking } from "../controller/booking.controller.js";
import asyncWrapper from "../middleware/asyncWrapper.js";
import { VerifyOwnerToken, VerifyUserToken } from "../middleware/verifyToken.js";
import { rateLimiter } from "../middleware/RateLimits.js";

const router = express.Router()

router.route('/')
            .post(rateLimiter,asyncWrapper(AddBookingAndPay))


router.route('/:id')
             .get(rateLimiter,VerifyUserToken, asyncWrapper(GetSingleBooking))
             .put(rateLimiter,VerifyUserToken , asyncWrapper(UpdateBooking))
             .delete(rateLimiter,VerifyUserToken , asyncWrapper(DeleteBooking))


export default router