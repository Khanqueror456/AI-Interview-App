import ollama from "ollama";


const extractJobFeatures = async (job) => {

    const prompt = `
You are a job description parser.

Extract structured information from the following job posting.

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations.

Required JSON format:

{
    "role": "",
    "skills": [],
    "experienceYearsMin": null,
    "experienceYearsMax": null,
    "employmentType": "",
    "location": "",
    "education": [],
    "description": ""
}

Job Title:
${job.title}

Company:
${job.company}

Location:
${job.location}

Description:
${job.description}
`;


    try {

        const response = await ollama.chat({
        model: "qwen3:8b",
        format: "json",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ]
    })


        const result = JSON.parse(
            response.message.content
        );


        return {
            ...result,

            externalId: job.externalId,
            company: job.company,
            applyUrl: job.applyUrl,
            source: job.source
        };

    } catch (error) {

        console.error(
            "Job feature extraction error:",
            error.response?.data || error.message
        );

        throw new Error(
            "Failed to extract job features"
        );
    }
};


export default extractJobFeatures;