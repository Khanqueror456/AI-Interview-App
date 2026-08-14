import api from "./api";

export const getInterviews = async () => {

    const response = await api.get("/interviews");

    return response.data;
}

export const createInterview = async (data) => {

    console.log(data);
    const response = await api.post("/interviews", data);

    return response.data;
}

export const getInterview = async (id) => {

    const response = await api.get(`/interviews/${id}`);
    return response.data.interview;
}

export const submitAnswer = async (id, data) => {

    const response = await api.post(`/interviews/${id}/answer`, data);
    return response.data;

}

export const startInterview = async (id) => {

    const response = await api.post(`/interviews/${id}/start`);
    return response.data;
}

export const resumeInterview = async (id) => {

    const response = await api.post(`/interviews/${id}/resume`);
    return response.data;
    console.log(response.data);

}

export const pauseInterview = async (id) => {

    const response = await api.post(`/interviews/${id}/pause`);
    return response.data;
    console.log(response.data);
}

export const pauseInterviewOnExit = (id) => {

    const url =
        `http://localhost:3000/api/interviews/${id}/pause`;

    const blob = new Blob([], {
        type: "text/plain"
    });

    return navigator.sendBeacon(url, blob);
};

export const skipCurrentQuestion = async (id) => {

    const response = await api.post(`/interviews/${id}/skip`);
    return response.data;
}

export const finishInterview = async (id) => {

    const response = await api.post(`/interviews/${id}/finish`);
    return response.data;
}

export const generateInterviewReport = async (id) => {

    const response = await api.post(`/interviews/${id}/report`);
    return response.data;
}

export const getInterviewReport = async (id) => {

    const response = await api.get(`/interviews/${id}/report`);
    return response.data;
}

export const getQuestionAnalysis = async (id, currentQuestionIndex) => {

    const response = await api.get(
        `/interviews/${id}/analysis`,
        {
            params: {
                question: currentQuestionIndex
            }
        }
    );

    return response.data;
};