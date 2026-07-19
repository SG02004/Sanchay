import axios from "axios";

// Create a reusable axios instance — reads base URL from .env file
// In Vite, env variables with VITE_ prefix are accessible via import.meta.env
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// REQUEST INTERCEPTOR — runs before EVERY API call
// Automatically attaches the JWT token to the Authorization header
// Without this, you'd have to manually add the token to every single fetch call
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR — runs after EVERY API response
// Catches any HTTP errors globally and logs them
// Individual components can still catch errors in their own try/catch
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong";
    console.error("API Error:", errorMessage);
    return Promise.reject(error);
  }
);

export default API;
