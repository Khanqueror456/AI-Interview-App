import dotenv from "./config/env.js"
import express from "express";
import cookieParser from "cookie-parser"
import bcrypt from "bcrypt";
import path from "path";
import authRoutes from "./routes/authRoutes.js"
import errorHandler from "./middleware/errorMiddleware.js";
import helmet from "helmet"
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"
import interviewRoutes from "./routes/interviewRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

console.log("This is the frontend URL",process.env.FRONTEND_URL);

console.log("Current working directory:", process.cwd());
console.log(
    "Uploads path:",
    path.join(process.cwd(), "src", "uploads")
);

app.use("/uploads", express.static(
    path.join(process.cwd(), "uploads")
));

// app.use(cors({
//     origin : "http://localhost:5173",
//     credentials : true
// }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/interviews", interviewRoutes)
app.use("/api/speech", uploadRoutes);
app.use("/api/resumes", resumeRoutes);

app.use(errorHandler) // it should be after all routes


export default app;