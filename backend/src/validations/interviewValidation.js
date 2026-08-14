import { z } from "zod";

export const interviewSchema = z.object({
    targetRole: z
        .string()
        .trim()
        .min(1, "Target role is required"),

    experienceLevel: z
        .enum([
            "fresher",
            "junior",
            "mid",
            "senior"
        ]),

    difficulty: z
        .enum([
            "easy",
            "medium",
            "hard"
        ]),

    totalQuestions: z
        .number()
        .int()
        .min(1, "At least one question is required")
        .max(20, "Maximum 20 questions are allowed")
});