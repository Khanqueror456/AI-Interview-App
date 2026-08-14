import { getDuration } from "./getDuration.js";

export const getInterviewSummary = (interview) => {


        const role = interview.targetRole;
        const experience = interview.experienceLevel;
        const difficulty = interview.difficulty;
        const totalQuestions = interview.totalQuestions;
        const correctlyAnswered = interview.correctlyAnswered;
        const overallScore = interview.score;
        const status = interview.status;
        const attemptedQuestions = interview.attemptedQuestions
        const durationMs = interview.endedAt - interview.startedAt;
        const duration = getDuration(durationMs)
        const endedAt = interview.endedAt;

        return {
            role,
            experience,
            difficulty,
            totalQuestions,
            correctlyAnswered,
            overallScore,
            duration,
            status,
            endedAt
        }
}