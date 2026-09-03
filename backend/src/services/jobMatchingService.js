import ollama from "ollama";

const calculateJobMatch = async (candidateFeatures, jobFeatures) => {

    // Give each job a temporary index that the LLM can use
    const jobsForLLM = jobFeatures.map((job, index) => ({
        jobIndex: index,
        title: job.title,
        description: job.description,
        skills: job.skills,
        experienceRequired: job.experienceRequired
    }));

    const prompt = `You are an AI job matching engine.

Compare the candidate profile against every provided job.

Rules:

1. Understand semantic similarity.
2. Treat abbreviations and their full forms as equivalent when appropriate.
3. Do not require exact string matches.
4. Consider related roles as partial matches.
5. Consider the candidate's actual experience against the job requirements.
6. Missing skills must be genuinely relevant to the job and absent from the candidate.
7. Do not give a high score simply because the job title is similar.
8. Lower the score when important required skills are missing.
9. Consider both the structured job skills and the full job description.
10. All scores must be integers from 0 to 100.
11. Generate exactly one jobMatches entry for every provided job.
12. Do not skip any job.
13. Use the exact jobIndex provided for each job.
14. Never create, modify, or invent a jobIndex.
15. Do not invent candidate experience or skills.
16. overallScore represents suitability for that particular job.
17. overallRelevance represents the candidate's overall suitability across all jobs.

CANDIDATE:

${JSON.stringify(candidateFeatures, null, 2)}

JOBS:

${JSON.stringify(jobsForLLM, null, 2)}
`;

    const jobMatchSchema = {
        type: "object",

        properties: {
            overallRelevance: {
                type: "integer",
                minimum: 0,
                maximum: 100
            },

            jobMatches: {
                type: "array",

                items: {
                    type: "object",

                    properties: {

                        jobIndex: {
                            type: "integer",
                            minimum: 0
                        },

                        overallScore: {
                            type: "integer",
                            minimum: 0,
                            maximum: 100
                        },

                        skillMatch: {
                            type: "object",

                            properties: {
                                score: {
                                    type: "integer",
                                    minimum: 0,
                                    maximum: 100
                                },

                                matched: {
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },

                                missing: {
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },

                                reason: {
                                    type: "string"
                                }
                            },

                            required: [
                                "score",
                                "matched",
                                "missing",
                                "reason"
                            ]
                        },

                        roleMatch: {
                            type: "object",

                            properties: {
                                score: {
                                    type: "integer",
                                    minimum: 0,
                                    maximum: 100
                                },

                                reason: {
                                    type: "string"
                                }
                            },

                            required: [
                                "score",
                                "reason"
                            ]
                        },

                        experienceMatch: {
                            type: "object",

                            properties: {
                                score: {
                                    type: "integer",
                                    minimum: 0,
                                    maximum: 100
                                },

                                reason: {
                                    type: "string"
                                }
                            },

                            required: [
                                "score",
                                "reason"
                            ]
                        },

                        summary: {
                            type: "string"
                        }
                    },

                    required: [
                        "jobIndex",
                        "overallScore",
                        "skillMatch",
                        "roleMatch",
                        "experienceMatch",
                        "summary"
                    ]
                }
            }
        },

        required: [
            "overallRelevance",
            "jobMatches"
        ]
    };

    const response = await ollama.chat({
        model: "qwen3:8b",

        format: jobMatchSchema,

        messages: [
            {
                role: "user",
                content: prompt
            }
        ]
    });

    const result = JSON.parse(response.message.content);

    /*
     * Construct the final result using YOUR original job data.
     *
     * The LLM does NOT control:
     * - jobId
     * - jobTitle
     * - applyUrl
     */

    result.jobMatches = result.jobMatches.map((match) => {

        const originalJob = jobFeatures[match.jobIndex];

        // Safety check
        if (!originalJob) {
            throw new Error(
                `Invalid jobIndex returned by LLM: ${match.jobIndex}`
            );
        }

        return {
            jobId: originalJob.jobId,

            jobTitle: originalJob.role,

            overallScore: match.overallScore,

            skillMatch: match.skillMatch,

            roleMatch: match.roleMatch,

            experienceMatch: match.experienceMatch,

            applyUrl: originalJob.applyUrl,

            summary: match.summary
        };
    });

    return result;
};

export default calculateJobMatch;