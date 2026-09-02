import ollama from "ollama"

const calculateJobMatch = async (candidateFeatures, jobFeatures) => {

    const prompt = `
You are an AI job matching engine.

Your task is to compare a candidate profile against MULTIPLE job
descriptions and determine how suitable the candidate is for EACH job.

IMPORTANT RULES:

1. Understand semantic similarity.
2. Treat abbreviations and their full forms as equivalent when appropriate.

   Examples:
   - NAT = Network Address Translation
   - ACL = Access Control List
   - PAT = Port Address Translation

3. Do not require exact string matches.
4. Consider related roles as partial matches.
5. Consider the candidate's actual experience against the job requirement.
6. Missing skills should only contain skills that are genuinely relevant
   to the job and absent from the candidate.
7. Do not give a high score simply because the job title is similar.
8. Give a lower score when important required skills are missing.
9. Consider the job description in addition to the structured job skills.
10. Scores must be integers from 0 to 100.
11. Return ONLY valid JSON.
12. Do not use markdown.
13. Return exactly ONE result for EACH job.
14. Do not skip any job.
15. Preserve the externalId of each job so the result can be associated
    with the original job.
16. overallScore represents how suitable the candidate is for that
    particular job.
17. overallRelevance represents the candidate's overall suitability
    across ALL provided jobs.
18. Generate JSON strictly as given
19. Any deviation from the given JSON structure will counted as failed result

CANDIDATE:

${JSON.stringify(candidateFeatures, null, 2)}


JOBS:

${JSON.stringify(jobFeatures, null, 2)}


Return exactly this JSON structure:

{
    "overallRelevance": 0,

    "jobMatches": [
        {
            "jobId": "",

            jobTitle : "",

            "overallScore": 0,

            "skillMatch": {
                "score": 0,
                "matched": [],
                "missing": [],
                "reason": ""
            },

            "roleMatch": {
                "score": 0,
                "reason": ""
            },

            "experienceMatch": {
                "score": 0,
                "reason": ""
            },

            "summary": ""
        }
    ],

}
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
    })

    const text = response.message.content;

    const result = JSON.parse(text);

    return result;
}

export default calculateJobMatch;