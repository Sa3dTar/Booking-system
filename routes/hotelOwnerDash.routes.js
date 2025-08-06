import express from "express";
import GetData from "../controller/hotelOwnerDashboard.controller.js";
import { rateLimiter } from "../middleware/RateLimits.js";

const router = express.Router()

router.route('/:id')
            .get(rateLimiter,GetData)

export default router