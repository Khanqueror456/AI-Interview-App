import jwt from "jsonwebtoken"
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {

    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "User not authorized" })
        }
        const decoded = jwt.verify(token, "jsonsecret");

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
    } catch (error) {

        return res.status(400).json({ message: "Invalid signature or token expired" });
    }

    next();
}