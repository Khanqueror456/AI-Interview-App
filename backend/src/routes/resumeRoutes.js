import express from "express";

import { getResume, uploadResume, getResumes, deleteResume } from "../controllers/resumeController.js";
import uploadResumeMiddleware from "../middleware/resumeUpload.js";
import {protectRoute} from "../middleware/authMiddleware.js";
import { getJobMatches, getJobsMatches, searchAndMatchJobs } from "../controllers/jobController.js";

const router = express.Router();


router.get("/:id", protectRoute, getResume);

router.get("/", protectRoute, getResumes);

router.get("/jobs-matches/:id", protectRoute, getJobsMatches);

router.get("/job-matches/:id", protectRoute, getJobMatches);

router.post(
    "/upload",
    protectRoute,
    uploadResumeMiddleware.single("resume"),
    uploadResume
)

router.post("/job-matches/:id", protectRoute, searchAndMatchJobs);

router.delete("/:id", protectRoute, deleteResume);

export default router;