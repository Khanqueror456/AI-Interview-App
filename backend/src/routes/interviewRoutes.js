import express from "express"
import {getInterview, createInterview, finishInterview, getCurrentQuestion, generateInterviewReport, getInterviews, startInterview, submitAnswer, getQuestionAnalysis, pauseInterview, resumeInterview, getInterviewReport, skipCurrentQuestion } from "../controllers/inteviewController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { interviewSchema } from "../validations/interviewValidation.js";

const router = express.Router();

router.get("/", protectRoute, getInterviews)
router.get("/:id", protectRoute, getInterview)
router.get("/:id/current-question", protectRoute, getCurrentQuestion)
router.get("/:id/report", protectRoute, getInterviewReport);
router.get("/:id/analysis", protectRoute, getQuestionAnalysis);

router.post("/", protectRoute, validate(interviewSchema), createInterview);
router.post("/:id/start", protectRoute, startInterview);
router.post("/:id/resume", protectRoute, resumeInterview);
router.post("/:id/pause", protectRoute, pauseInterview);
router.post("/:id/answer", protectRoute, submitAnswer);
router.post("/:id/skip", protectRoute, skipCurrentQuestion);
router.post("/:id/finish", protectRoute, finishInterview);
router.post("/:id/report", protectRoute, generateInterviewReport)


export default router;