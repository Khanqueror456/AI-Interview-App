// import axios from "axios";

// const api = axios.create({
//     baseURL : "http://localhost:3000/api",
//     withCredentials : true,
//     timeout: 3000000
// })

// export default api;


import axios from "axios";

const api = axios.create({
   
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api", 
    withCredentials: true,
})

console.log("This is the backend url", import.meta.env.VITE_API_URL)

export default api;