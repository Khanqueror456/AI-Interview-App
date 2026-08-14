import { z } from "zod";

export const createInterviewSchema = z.object({

    targetRole : z
                .string()
                .min(1, "Target role is required"),

    experienceLevel : z
                .string()
                .min(1, "Experience level is required"),

    difficulty : z
                .string()
                .min(1, "Difficulty is required"),

    totalQuestions : z
                .number()
                .int()
                .min(1, "At least 1 question is required")
                .max(10, "Maximum 10 questions allowed")
});