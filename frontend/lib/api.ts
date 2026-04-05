
import axios from "axios";

const apis = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});
// for refresh the token 
apis.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post("/auth/refresh"); // your refresh API
        const newToken = res.data.token;

        // localStorage.setItem("token", newToken);

        // // update header
        // originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest); // retry request
      } catch (err) {
        console.log("Session expired");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
export default apis;