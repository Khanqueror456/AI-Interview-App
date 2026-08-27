import axios from "axios";

const api = axios.create({
    baseURL : "http://localhost:3000/api",
    withCredentials : true,
    timeout: 3000000
})

export default api;