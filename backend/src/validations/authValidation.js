import {z} from "zod";

export const signupSchema = z.object({

    name : z
        .string(),

    email : z.email("Invalid email address"),

    password : z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(30)
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[a-z]/, "Must contain a lowercase letter")
        .regex(/[0-9]/, "Must contain a number")
});

export const loginSchema = z.object({
    email : z.email(),
    password : z.string().min(1)
})