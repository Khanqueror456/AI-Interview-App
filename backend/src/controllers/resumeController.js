import Resume from "../models/Resume.js";
import asyncHandler from "../utils/asyncHandler.js";
import { analyzeResumeWithAI, extractResumeText, parseResumeWithAI } from "../services/resumeService.js";


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

    const analysis = await analyzeResumeWithAI(parsedData);

    const resume = await Resume.create({
        user : req.user.id,

        originalFile : {
            filename : req.file.originalname,
            path : req.file.path
        },

        rawText: resumeText,

        parsedData,

        analysis
    });

    return res.status(201).json({
        success : true,
        message : "Resume uploaded successfully",
        resume
    });
});


export const getResume = asyncHandler(async (req, res, next) => {

    const resume = await Resume.findOne({
        _id : req.params.id,
        user : req.user._id
    });


    if (!resume)
    {
        return res.status(404).json({
            success : false,
            message : "Resume not found"
        });
    }

    return res.status(200).json({
        success : true,
        resume
    });
})