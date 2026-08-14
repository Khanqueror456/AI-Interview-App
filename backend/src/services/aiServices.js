import ollama from "ollama";

export const generateInterviewQuestions = async (
    role,
    experience,
    difficulty,
    totalQuestions
) => {
    //     const prompt = `
    // Generate ${totalQuestions} interview questions.

    // Role: ${role}

    // Experience Level: ${experience}

    // Difficulty: ${difficulty}

    // Return ONLY a JSON array.

    // Example:

    // [
    //   {
    //     "question": "What is React?"
    //   }
    // ]
    //   Follow the format given above strictly for questions.
    // `;

    const prompt = `
Generate exactly ${totalQuestions} technical interview questions.

Role: ${role}

Experience Level: ${experience}

Difficulty: ${difficulty}

Requirements:
- Questions must match the specified role.
- Questions should match the specified experience level.
- Questions should match the specified difficulty.
- Do not repeat questions.
- Do not include numbering.
- Do not include explanations.
- Do not include markdown.
- Return ONLY valid JSON.

Return the response in the following format exactly:

[
  {
    "question": "What is React?"
  },
  {
    "question": "Explain the Virtual DOM."
  }
]

Do not return any text before or after the JSON array.
`;

    const response = await ollama.chat({
        model: "qwen3:8b",
        format: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: {
                        type: "string"
                    }
                },
                required: ["question"]
            }
        },
        messages: [
            {
                role: "user",
                content: prompt
            }
        ]
    })

    const content = response.message.content;

    const questions = JSON.parse(content);

    return questions;
}

export const getAnswerFeedback = async (question, answer, role, experience, difficulty) => {

    const prompt = `
    You are a Senior Technical Interviewer.

    Evaluate the candidate's interview answer based on the following information.

    Role:
    ${role}

    Experience Level:
    ${experience}

    Difficulty:
    ${difficulty}

    Interview Question:
    ${question}

    Candidate's Answer:
    ${answer}

    Evaluate the answer based on:

    1. Technical Accuracy
    2. Completeness
    3. Clarity of Explanation
    4. Practical Understanding

    Give a score between 0 and 10.

    Return ONLY valid JSON in the following format.

    {
        "score": score given by you based on answer evaluation,
        "feedback": Give a feedback based on you analysis of answer based on 4 poits mentioned above,
        "idealAnswer" : Give the ideal answer the user was supposed to give for the current question
    }

    Do not include markdown, code blocks, or any extra text.
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

    const feedback = JSON.parse(text);

    return feedback;
}

export const getSkillBreakdown = async (interview) => {

    const questions = []

    for (let i = 0; i < interview.questions.length; i++) {
        questions.push(interview.questions[i].question);
    }


    const prompt = `You are an expert at analyzing interview and exam questions.

        Your task is to identify the topics covered by the given list of questions and estimate the percentage composition of each topic.

        Instructions:
        1. Analyze every question in the input array.
        2. Identify the primary topic(s) being tested.
        3. Group similar questions under the same topic.
        4. Calculate the percentage distribution of topics based on the total number of questions.
        5. The percentages should sum to exactly 100.
        6. Use concise, standardized topic names.
        7. Do not include any explanation, reasoning, or markdown.
        8. Return ONLY a valid JSON object.

        Input:
        [
        "Question 1",
        "Question 2",
        "Question 3"
        ]

        Output Format:
        {
        "Topic 1": 45,
        "Topic 2": 30,
        "Topic 3": 15,
        "Topic 4": 10
        }

        Rules:
        - Percentages must be integers.
        - If a question spans multiple topics, assign it to the most dominant topic.
        - Do not create overly specific topics; prefer broader categories (e.g., "Arrays" instead of "Two Pointer Array Traversal" unless necessary).
        - The output must be valid JSON only.
        Quesions are ${questions}
        `

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

    const skillBreakdown = JSON.parse(text);

    return skillBreakdown;
}
