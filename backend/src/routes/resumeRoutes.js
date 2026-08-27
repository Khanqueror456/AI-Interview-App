import express from "express";

import { uploadResume } from "../controllers/resumeController.js";
import uploadResumeMiddleware from "../middleware/resumeUpload.js";
import {protectRoute} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/upload",
    protectRoute,
    uploadResumeMiddleware.single("resume"),
    uploadResume
)

export default router;