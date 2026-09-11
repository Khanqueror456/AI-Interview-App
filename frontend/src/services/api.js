import axios from "axios";

const api = axios.create({
    baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
    withCredentials : true,
    timeout: 3000000
})

// console.log(process.env.REACT_APP_API_URL);

export default api;