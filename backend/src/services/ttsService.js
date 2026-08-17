import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";


import groq from "../config/groq.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateQuestionAudio = async (text) => {

    if (!text || !text.trim())
    {
        throw new Error("Test is required for TTS");
    }

    const response = await groq.audio.speech.create({
        model : "canopylabs/orpheus-v1-english",
        voice : "hannah",
        input : text,
        response_format : "wav"
    });

    const audioBuffer = Buffer.from(
        await response.arrayBuffer()
    )

    const fileName = `${randomUUID()}.wav`;

    const uploadDirectory = path.join(
        __dirname,
        "../uploads/tts"
    );

    await fs.mkdir(uploadDirectory, {
        recursive : true
    });

    const filePath = path.join(
        uploadDirectory,
        fileName
    );

    await fs.writeFile(
        filePath,
        audioBuffer
    );

    return `/uploads/tts/${fileName}`;
};

export default generateQuestionAudio;