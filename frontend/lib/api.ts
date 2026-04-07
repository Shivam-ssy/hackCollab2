import axios from "axios";

const apis = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

// Define the maximum number of retries
const MAX_RETRIES = 3;

// apis.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Initialize retry count if it doesn't exist
//     if (originalRequest._retryCount === undefined) {
//       originalRequest._retryCount = 0;
//     }

//     // 🔥 Check: 401 Error AND under the retry limit
//     if (
//       error.response?.status === 401 && 
//       originalRequest._retryCount < MAX_RETRIES
//     ) {
      
//       // Stop if the refresh endpoint itself is what's failing
//       if (originalRequest.url === "/users/users/refresh-token") {
//         return Promise.reject(error);
//       }

//       // Increment the retry counter
//       originalRequest._retryCount++;

//       try {
//         // ✅ Attempt to refresh the token
//         await apis.post("/users/users/refresh-token");

//         // ✅ Retry the original request with the incremented counter
//         return apis(originalRequest);

//       } catch (err) {
//         // If refresh fails, don't keep retrying; go to login
//         if (typeof window !== "undefined") {
//           window.location.href = "/login";
//         }
//         return Promise.reject(err);
//       }
//     }

//     // If we've reached the MAX_RETRIES or it's a different error
//     if (originalRequest._retryCount >= MAX_RETRIES) {
//       console.error(`Max retries (${MAX_RETRIES}) reached.`);
//       if (typeof window !== "undefined") {
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default apis;