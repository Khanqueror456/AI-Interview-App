import Resume from "../models/Resume.js";
import asyncHandler from "../utils/asyncHandler.js";
import { extractResumeText, parseResumeWithAI } from "../services/resumeService.js";


export const uploadResume = asyncHandler( async (req, res, next) => {

    if (!req.file){
        return res.status(400).json({
            success : false,
            message : "Resume file is required"
        });
    }

    const resumeText = await extractResumeText(req.file.path);
    console.log(resumeText);

    const parsedData = await parseResumeWithAI(resumeText);

    const resume = await Resume.create({
        user : req.user.id,

        originalFile : {
            filename : req.file.originalname,
            path : req.file.path
        },

        rawText: resumeText,

        parsedData
    });

    return res.status(201).json({
        success : true,
        message : "Resume uploaded successfully",
        resume
    });
})