// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // your backend API
  withCredentials: true, // ✅ send cookies automatically
});

export default api;
