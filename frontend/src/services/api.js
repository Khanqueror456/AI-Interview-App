import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    withCredentials : true,
    timeout: 3000000
})

export default api;