import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Check if token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest.url.includes("/auth/login")
    ) {
      originalRequest._retry = true;

      try {
        // Try refreshing the token
        await api.post("/auth/refresh");
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          window.location.replace("/login?expired=1");
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
