import express from "express";

import { getResume, uploadResume, getResumes, deleteResume } from "../controllers/resumeController.js";
import uploadResumeMiddleware from "../middleware/resumeUpload.js";
import {protectRoute} from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/:id", protectRoute, getResume);

router.get("/", protectRoute, getResumes)

router.post(
    "/upload",
    protectRoute,
    uploadResumeMiddleware.single("resume"),
    uploadResume
)

router.delete("/:id", protectRoute, deleteResume);

export default router;