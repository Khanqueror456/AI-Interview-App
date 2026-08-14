import express from "express";
import {login, logout, signup} from "../controllers/authController.js"
import { validate } from "../middleware/validateMiddleware.js";
import { signupSchema, loginSchema } from "../validations/authValidation.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import reqLimiter from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/signup", reqLimiter, validate(signupSchema), signup);

router.post("/login", reqLimiter, validate(loginSchema), login);

router.post("/logout", reqLimiter, logout);

export default router;