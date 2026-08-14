import rateLimit from "express-rate-limit"

const reqLimiter = rateLimit({
    windowMs : 1 * 60 * 1000,
    max : 5,
    handler : (req, res) => {
        res.status(429).json({message : "Too many requests, try later..."})
    },
})

export default reqLimiter;