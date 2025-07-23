// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5050",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Hängt Token (sofern vorhanden) an jeden Request an
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

export default api;
