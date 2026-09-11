import axios from "axios";

const api = axios.create({
    // ✅ MUST start with REACT_APP_ and point to the RENDER backend
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000",
    withCredentials: true,
    timeout: 3000000
})

export default api;