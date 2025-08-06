import express from "express";
import { GetAllBooking, GetAllRoomsHotel, GetAllUSers, getSingleUSer } from "../controller/AdminDash.controller.js";
import { GetAllHotels } from "../controller/hotel.controller.js";
import { rateLimiter } from "../middleware/RateLimits.js";
const router = express.Router()

router.route('/bookings')
             .get(rateLimiter,GetAllBooking)

router.route('/users')
             .get(rateLimiter,GetAllUSers)

router.route('/users/:id')
             .get(rateLimiter,getSingleUSer)


router.route('/rooms')
             .get(rateLimiter,GetAllRoomsHotel)


router.route('/hotels')
             .get(rateLimiter,GetAllHotels)


export default router