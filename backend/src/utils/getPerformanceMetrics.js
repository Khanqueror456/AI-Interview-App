import { getDuration } from "./getDuration.js";

export const getPerformanceMetrics = (interview) => {

    const sortedQuestions = [...interview.questions]
        .sort((a, b) => a.score - b.score);

    const correctlyAnswered = interview.correctlyAnswered;
    const durationMs = interview.endedAt - interview.startedAt;
    const duration = getDuration(durationMs)
    const totalQuestions = interview.totalQuestions;
    const attemptedQuestions = interview.attemptedQuestions;
    const overallScore = interview.score;
    const avgScorePerQuestion = Math.round(overallScore / totalQuestions)
    const highestScoreQuestion = sortedQuestions[totalQuestions - 1].score;
    const leastScoreQuestion = sortedQuestions[0].score;
    const questionsSkipped = totalQuestions - attemptedQuestions;
    const completionPercentage = Math.round((attemptedQuestions / totalQuestions) * 100);
    const avgTimePerQuestion = getDuration(Math.round(durationMs / attemptedQuestions));


    return {
            overallScore,
            correctlyAnswered,
            avgScorePerQuestion,
            highestScoreQuestion,
            leastScoreQuestion,
            questionsSkipped,
            completionPercentage,
            duration,
            avgTimePerQuestion

        }
}