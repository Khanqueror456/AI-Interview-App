import api from "./api";

export const uploadResume = async (file) => {

    const formData = new FormData();

    formData.append("resume", file);

    const response = await api.post(
        "/resumes/upload",
        formData
    );

    return response.data;
};

export const getResume = async(id) => {

    const response = await api.get(`/resumes/${id}`);

    return response.data;
}

export const getResumes = async () => {

    const response = await api.get("/resumes");

    console.log("response data", response.data);

    return response.data;
};


export const deleteResume = async (id) => {

    const response = await api.delete(`/resumes/${id}`);

    return response.data;
};