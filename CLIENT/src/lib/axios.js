import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "/api/v1", // ✅ no need for localhost:4000 anymore
  withCredentials: true,
});
