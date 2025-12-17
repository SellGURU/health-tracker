// import axios from "axios";
// // import { useToast } from "@/hooks/use-toast";

// // const { toast } = useToast();

// axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // console.log(error);
//     // if (
//     //   error.response?.status == 401 ) {
//     //   localStorage.clear();
//     //   // Avoid full reload on mobile WebView; navigate to auth route instead
//     //   window.location.href = "/auth";
//     // }
//     if (error.response?.status == 401) {
//       // Don't reload page for login endpoint - let the login page handle the error
//       const requestUrl = error.config?.url || '';
//       const isLoginEndpoint = requestUrl.includes('/auth/mobile_token') || requestUrl.includes('/auth/mobile_register');

//       if (!isLoginEndpoint) {
//         // Save brand_info before clearing localStorage
//         const brandInfo = localStorage.getItem("brand_info");
//         localStorage.clear();
//         // Restore brand_info if it existed
//         if (brandInfo) {
//           localStorage.setItem("brand_info", brandInfo);
//         }
//         window.location.href = "/auth";
//         // window.location.reload();
//       }
//     }

//     return Promise.reject(error);
//   }
// );
import axios, { AxiosRequestConfig } from "axios";
import Auth from "./auth";
import { resolveBaseEndPoint } from "./base";
import { getTokenFromLocalStorage } from "../store/token";

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: resolveBaseEndPoint(),
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

/* ================= Request ================= */
api.interceptors.request.use((config) => {
  const token = getTokenFromLocalStorage();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ================= Response ================= */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as RetryConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const url = originalRequest.url || "";

      if (
        url.includes("/auth/mobile_token") ||
        url.includes("/auth/mobile_register") ||
        url.includes("/auth/refresh")
      ) {
        return Promise.reject(error);
      }

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        window.location.href = "/auth";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers = originalRequest.headers ?? {};
              originalRequest.headers.Authorization = "Bearer " + token;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await Auth.refreshToken(refreshToken);

        localStorage.setItem("health_session", data.access_token);
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("encoded_mi", data.encoded_mi);
        localStorage.setItem("refresh_token", data.refresh_token);

        api.defaults.headers.common.Authorization =
          "Bearer " + data.access_token;

        processQueue(null, data.access_token);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = "Bearer " + data.access_token;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);

        const brandInfo = localStorage.getItem("brand_info");
        localStorage.clear();
        if (brandInfo) localStorage.setItem("brand_info", brandInfo);

        window.location.href = "/auth";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
