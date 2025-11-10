import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api/v1", // 👈 your backend URL
  withCredentials: true, // important if using cookies
});
