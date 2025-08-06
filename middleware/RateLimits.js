import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
    windowMs : 30 * 60 * 1000,
    max: 100,
    message : 'try again later',
    standardHeaders : true,
    legacyHeaders : false
})

export const loginRateLimiter = rateLimit({
    windowMs: 120 * 60 * 1000,
    max : 5,
    message : 'try again later',
    standardHeaders : true,
    legacyHeaders : false
})