import rateLimiter from 'express-rate-limit';


export const basicLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

//Strict rate limiter for authentication endpoints
export const authLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later.',
    skipSuccessfulRequests: true,
});

//API rate limiter
export const apiLimiter = rateLimiter({
    windowMs: 60 * 1000,
    max: 30,
    message: 'API rate limit exceeded',
});
