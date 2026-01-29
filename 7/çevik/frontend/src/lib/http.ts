// http.ts
import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true,
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const cfg: any = err?.config || {};
    const redirectOnAuthError = cfg?.meta?.redirectOnAuthError === true;

    if ((status === 401 || status === 403) && redirectOnAuthError) {
      sessionStorage.setItem("postLoginRedirect", window.location.pathname + window.location.search);
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);
