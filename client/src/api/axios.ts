import axios from "axios";
import Auth from "./auth";

// Guard so multiple simultaneous 401s only trigger one refresh/redirect.
let isHandlingAuthError = false;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status == 401) {
      const requestUrl = error.config?.url || "";
      // Let the auth endpoints reject normally so their own pages can show a
      // user-friendly message (e.g. "invalid credentials"). Also excludes the
      // refresh endpoint to avoid an infinite refresh loop.
      const isAuthEndpoint =
        requestUrl.includes("/auth/mobile_token") ||
        requestUrl.includes("/auth/mobile_register") ||
        requestUrl.includes("/auth/mobile_refresh");

      if (!isAuthEndpoint) {
        if (!isHandlingAuthError) {
          isHandlingAuthError = true;
          // Try to silently refresh the session.
          Auth.refreshToken()
            .then((res) => {
              localStorage.setItem("health_session", res.data.access_token);
              localStorage.setItem("token", res.data.access_token);
              localStorage.setItem("encoded_mi", res.data.encoded_mi);
              localStorage.setItem("refresh_token", res.data.refresh_token);
              window.location.reload();
            })
            .catch(() => {
              const brandInfo = localStorage.getItem("brand_info");
              const biometricEnabled =
                localStorage.getItem("biometric_enabled");
              localStorage.clear();
              // Restore brand_info if it existed
              if (brandInfo) {
                localStorage.setItem("brand_info", brandInfo);
              }
              if (biometricEnabled) {
                localStorage.setItem("biometric_enabled", biometricEnabled);
              }
              window.location.href = "/auth";
            });
        }

        // Swallow the rejection: return a promise that never settles so the
        // per-request `.catch()` handlers don't surface technical toasts like
        // "token expired". The page reloads or redirects to /auth once the
        // refresh attempt finishes.
        return new Promise(() => {});
      }
    }

    return Promise.reject(error);
  }
);
