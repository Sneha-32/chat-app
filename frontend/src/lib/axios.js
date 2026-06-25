import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:"http://localhost:5001/api",
    withCredentials:true,            //includes cookies when sending requests
})


//instead of using the default Axios object everywhere, we are creating our own customized version
