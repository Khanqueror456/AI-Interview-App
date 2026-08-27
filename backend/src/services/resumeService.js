import fs from "fs";
import { PDFParse } from "pdf-parse";
import ollama from "ollama";

export const extractResumeText = async (filePath) => {

    const buffer = fs.readFileSync(filePath);

    const parser = new PDFParse({
        data: buffer
    });

    const result = await parser.getText();

    await parser.destroy();

    return result.text;
};

export const parseResumeWithAI = async (resumeText) => {

    const prompt = `
You are a resume parsing system.

Analyze the following resume and extract the information into
the exact JSON structure provided below.

Rules:

1. Only extract information explicitly present in the resume.
2. Never invent or assume information.
3. If information is unavailable, use an empty string or empty array.
4. Preserve the meaning of the original information.
5. Return ONLY valid JSON.
6. Do not include markdown code fences.
7. Do not add fields that are not present in the schema.

JSON structure:

{
    "personalInfo": {
        "name": "",
        "email": "",
        "phone": "",
        "location": ""
    },

    "summary": "",

    "education": [
        {
            "institution": "",
            "degree": "",
            "field": "",
            "startDate": "",
            "endDate": ""
        }
    ],

    "experience": [
        {
            "company": "",
            "position": "",
            "startDate": "",
            "endDate": "",
            "description": ""
        }
    ],

    "projects": [
        {
            "name": "",
            "description": "",
            "technologies": []
        }
    ],

    "skills": [],

    "certifications": [],

    "links": {
        "github": "",
        "linkedin": "",
        "portfolio": ""
    }
}

Resume:

${resumeText}
`;

    const response = await ollama.chat({
        model: "qwen3:8b",
        format: "json",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ]
    });

    const text = response.message.content;

    const parsedData = JSON.parse(text);

    return parsedData;
}