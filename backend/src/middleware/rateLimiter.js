import rateLimit from "express-rate-limit"

const reqLimiter = rateLimit({
    windowMs : 1 * 60 * 1000,
    max : 5000,
    handler : (req, res) => {
        res.status(429).json({message : "Too many requests, try later..."})
    },
})

export default reqLimiter;