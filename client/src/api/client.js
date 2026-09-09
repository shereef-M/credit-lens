import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const createApplication = (data) => api.post("/api/applications", data);
export const getApplications = () => api.get("/api/applications");

export default api;
