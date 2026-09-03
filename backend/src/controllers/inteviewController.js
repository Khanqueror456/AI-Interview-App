import asyncHandler from "../utils/asyncHandler.js"
import { generateInterviewQuestions, getAnswerFeedback } from "../services/aiServices.js"
import Interview from "../models/Interview.js"
import Question from "../models/Question.js"
import mongoose, { mongo } from "mongoose"
import { getDuration } from "../utils/getDuration.js"
import { getInterviewSummary } from "../utils/getInterviewSummary.js"
import { getPerformanceMetrics } from "../utils/getPerformanceMetrics.js"
import { getSkillBreakdown } from "../services/aiServices.js"
import generateQuestionAudio from "../services/ttsService.js"

export const getInterview = asyncHandler(async (req, res) => {

    const interviewId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
        return res.status(400).json({
            message: "Invalid interview ID"
        });
    }

    const interview = await Interview.findOne({ _id: interviewId, owner: req.user._id }).populate("questions");

    if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
    }

    res.status(200).json({ success: true, interview })
})

export const getInterviews = asyncHandler(async (req, res) => {

    const interviews = await Interview.find({ owner: req.user._id })
        .select("targetRole experienceLevel difficulty questions status score createdAt")
        .sort({ createdAt: -1 });


    res.status(200).json({ success: true, count: interviews.length, interviews })

})

export const createInterview = asyncHandler(async (req, res) => {

    const { targetRole, experienceLevel, difficulty, totalQuestions } = req.body;
    const questions = await generateInterviewQuestions(targetRole, experienceLevel, difficulty, totalQuestions);
    const interview = new Interview({
        owner: req.user._id,
        targetRole,
        experienceLevel,
        difficulty,
        totalQuestions,
        startedAt: new Date(Date.now()).toISOString(),
        questions: []
    })

    const questionIds = [];

    for (const q of questions) {

        const question = await Question.create({
            interview: interview._id,
            question: q.question
        });

        questionIds.push(question._id);
    }

    for (const qId of questionIds) {
        const question = await Question.findById(qId);
        const audioURL = await generateQuestionAudio(question.question);

        question.audioURL = audioURL;

        await question.save();
    }

    interview.questions = questionIds;
    await interview.save();

    res.status(201).json({ status: interview.status, id: interview._id });
})

export const startInterview = asyncHandler(async (req, res) => {

    const interviewId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
        return res.status(400).json({
            message: "Invalid interview ID"
        });
    }
    const interview = await Interview.findOne({
        owner: userId,
        _id: interviewId
    })

    if (!interview) {
        return res.status(400).json({ message: "Interview not found" })
    }

    if (interview.status !== "created") {
        return res.status(400).json({ message: "Interview status not valid" })
    }

    interview.status = "in-progress";
    interview.startedAt = new Date(Date.now()).toISOString();

    await interview.save();
    res.status(200).json({
        success: true,
        status: interview.status,
        message: "Interview started successfully."
    })
})

export const resumeInterview = asyncHandler(async (req, res) => {

    const interviewId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
        return res.status(400).json({
            message: "Invalid interview ID"
        });
    }
    const interview = await Interview.findOne({
        owner: userId,
        _id: interviewId
    })

    if (!interview) {
        return res.status(400).json({ message: "Interview not found" })
    }

    if (interview.status !== "pending") {
        return res.status(400).json({ message: "Only pending interview can be resumed" })
    }

    interview.status = "in-progress";
    interview.resumedAt = new Date(Date.now()).toISOString();
    await interview.save();

    res.status(200).json({
        success: true,
        status: interview.status,
        message: "Interview resumed successfully."
    })
})

export const pauseInterview = asyncHandler(async (req, res) => {

    const interviewId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
        return res.status(400).json({
            message: "Invalid interview ID"
        });
    }
    const interview = await Interview.findOne({
        owner: userId,
        _id: interviewId
    })

    if (!interview) {
        return res.status(400).json({ message: "Interview not found" })
    }

    if (interview.status !== "in-progress") {
        return res.status(400).json({ message: "Only active interview can be paused" })
    }

    interview.status = "pending";
    interview.pausedAt = new Date(Date.now()).toISOString();
    await interview.save();

    res.status(200).json({
        success: true,
        status: interview.status,
        message: "Interview paused successfully."
    })
})

export const getCurrentQuestion = asyncHandler(async (req, res) => {

    const interviewId = req.params.id;
    const userId = req.user.id;
    const interview = await Interview.findOne({ _id: interviewId, owner: userId })

    if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.status !== "in-progress") {
        return res.status(400).json({ message: "Interview is not active" });
    }

    if (interview.currentQuestionsIndex >= interview.questions.length) {
        return res.status(400).json({ message: "Questions are over..." })
    }

    const question = await Question.findOne({ _id: interview.questions[interview.currentQuestionsIndex] });

    if (!question) {
        return res.status(404).json({
            message: "Question not found"
        });
    }



    res.status(200).json({
        "success": true,
        "currentQuestion": interview.currentQuestionsIndex,
        "totalQuestions": interview.questions.length,
        "question": {
            "_id": question._id,
            "question": question.question
        }
    });
})

export const skipCurrentQuestion = asyncHandler(async (req, res) => {

    const interviewId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
        return res.status(400).json({ message: "Interview id not valid" });
    }

    const interview = await Interview.findOne({
        _id: interviewId,
        owner: userId
    });

    if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
    }
    
    const currentQuestionsIndex = interview.currentQuestionsIndex++;
    await interview.save();
    if (
        interview.currentQuestionsIndex >=
        interview.questions.length
    ) {
        interview.status = "completed";
        interview.endedAt = new Date(Date.now()).toISOString();

        interview.save();

        const updatedInterview = await Interview.findOne({
            _id: interviewId,
        }).populate("questions");


        return res.status(200).json(
            updatedInterview
        )
    }



    await interview.save();

    console.log(currentQuestionsIndex);



    await interview.save();

    const updatedInterview = await Interview.findOne({
        _id: interviewId,
    }).populate("questions");

    console.log(updatedInterview.currentQuestionsIndex);

    return res.status(200).json(updatedInterview);
})

export const submitAnswer = asyncHandler(async (req, res) => {

    const answer = req.body.answer;
    const userId = req.user.id;
    const interviewId = req.params.id;
    const interview = await Interview.findOne({
        owner: userId,
        _id: interviewId
    })

    if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.status !== "in-progress") {
        return res.status(400).json({ message: "Interview not active" })
    }

    const targetRole = interview.targetRole;
    const experienceLevel = interview.experienceLevel;
    const difficulty = interview.difficulty;

    const question = await Question.findOne({ _id: interview.questions[interview.currentQuestionsIndex] });

    if (!question) {
        return res.status(404).json({ message: "Question not found" });
    }

    const feedback = await getAnswerFeedback(question, answer, targetRole, experienceLevel, difficulty);

    if (!feedback) {
        return res.status(500).json({ message: "Internal server error" });
    }

    question.answer = answer;
    question.score = feedback.score;
    question.feedback = feedback.feedback;
    question.idealAnswer = feedback.idealAnswer;

    await question.save();

    interview.currentQuestionsIndex++;
    
    await interview.save();
    
    if (
        interview.currentQuestionsIndex >=
        interview.questions.length
    ) {
        interview.status = "completed";
        interview.endedAt = new Date(Date.now()).toISOString();
        
        await interview.save();
        return res.status(200).json({
            success: true,
            feedback,
            interviewCompleted: true,
            interview
        })
    }

    res.status(200).json({
        success: true,
        feedback,
        currentQuestionIndex: interview.currentQuestionsIndex,
        interviewCompleted: false,
        interview
    });


})

export const finishInterview = asyncHandler(async (req, res) => {

    const interviewId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
        return res.status(400).json({ message: "Invalid interview id" });
    }

    const interview = await Interview.findOne({
        owner: userId,
        _id: interviewId
    }).populate({
        path: "questions",
        select: "score answer"
    })

    if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.status != "completed") {
        return res.status(400).json({ message: "Interview not over yet..." })
    }

    const questions = interview.questions;

    if (!questions) {
        return res.status(404).json({ message: "Questions not found" });
    }


    let overallScore = 0;
    let correctlyAnswered = 0;
    let attemptedQuestions = 0;
    const totalQuestions = questions.length;
    const totalScore = 10 * totalQuestions;

    for (let question of questions) {
        overallScore += question.score ?? 0;

        if (question.answer.trim() != "") {
            attemptedQuestions++;
        }

        if (question.score >= 5) {
            correctlyAnswered++;
        }
    }

    console.log("This is overall score",overallScore);
    console.log("This is total score", totalQuestions * 10);
    console.log((overallScore / (totalQuestions * 10)))
    // overallScore = Math.round((overallScore / totalScore) * 100);
    interview.score = Math.round((overallScore / (totalQuestions * 10)) * 100);
    interview.correctlyAnswered = correctlyAnswered;
    interview.attemptedQuestions = attemptedQuestions;

    await interview.save();

    res.status(200).json({
        success: true,
        overallScore,
        totalQuestions,
        correctlyAnswered,
        message: "Interview completed successfully"
    })
})

export const generateInterviewReport = asyncHandler(async (req, res) => {

    const interviewId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
        return res.status(400).json({ message: "Interview id not valid" })
    }

    const interview = await Interview.findOne({
        owner: userId,
        _id: interviewId
    }).populate("questions")

    if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
    }



    // Phase - 1 - Interview Summary

    const interviewSummary = getInterviewSummary(interview);

    // Phase - 2 - Performace metrics

    const performanceMetrics = getPerformanceMetrics(interview);
    interview.performanceMetrics = performanceMetrics;


    // Phase - 3 - Skill breakdown

    const skillBreakdown = await getSkillBreakdown(interview);
    interview.skillBreakdown = skillBreakdown;

    await interview.save();

    res.status(200).json({

        interviewSummary,
        performanceMetrics,
        skillBreakdown
    })
})

export const getInterviewReport = asyncHandler(async (req, res) => {

    const interviewId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
        return res.status(400).json({ message: "Interview id not valid" })
    }

    const interview = await Interview.findOne({
        _id: interviewId,
        owner: userId

    })

    if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
    }


    const interviewSummary = getInterviewSummary(interview);
    const performanceMetrics = interview.performanceMetrics;
    const skillBreakdown = interview.skillBreakdown;

    res.status(200).json({
        interviewSummary,
        performanceMetrics,
        skillBreakdown
    })

})

export const getQuestionAnalysis = asyncHandler(async (req, res) => {

    const interviewId = req.params.id;
    const userId = req.user.id;
    const currentQuestionIndex = Number(req.query.question);

    console.log("currentQuestionIndex", currentQuestionIndex);

    const interview = await Interview.findOne({
        owner: userId,
        _id: interviewId
    });

    if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.status !== "completed") {
        return res.status(400).json({ message: "Interview not over yet..." })
    }

    const questionId = interview.questions[currentQuestionIndex]._id;

    const question = await Question.findOne({
        _id: questionId
    })

    if (!question) {
        return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({

        success: true,

        analysis: {

            question: question.question,

            answer: question.answer,

            feedback: question.feedback,

            score: question.score,

            idealAnswer: question.idealAnswer
        }

    });

})