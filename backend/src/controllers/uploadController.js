import asyncHandler from "../utils/asyncHandler.js";
import groq from "../config/groq.js";
import { toFile } from "groq-sdk/uploads";

export const transcribeAudio = asyncHandler(async (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Audio file is required"
        })
    }

    console.log("Received audio:", {
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size
    });

    const audioFile = await toFile(
        req.file.buffer,
        req.file.originalname
    );

    const transcription =
        await groq.audio.transcriptions.create({
            file: audioFile,
            model: "whisper-large-v3-turbo",
            language: "en",
            response_format: "json"
        });

        console.log("Transcript:", transcription.text);

    res.status(200).json({
        success: true,
        transcript: transcription.text
    })
})