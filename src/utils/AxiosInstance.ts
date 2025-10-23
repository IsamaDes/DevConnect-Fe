import axios from 'axios';

axios.defaults.withCredentials = true; 

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  
});


// auto-refresh on 401
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${axiosInstance.defaults.baseURL}/auth/refresh-token`,
          null,
          { withCredentials: true }
        );
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;