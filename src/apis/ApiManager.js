import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const username = import.meta.env.VITE_BASIC_USER;
const password = import.meta.env.VITE_BASIC_PASS;

const api = axios.create({
  baseURL: BASE_URL,
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  responseType: "json",
});

api.interceptors.request.use((config) => {
  const token = btoa(`${username}:${password}`);
  let headerValue = JSON.parse(localStorage.getItem("fr"));
  
  config.headers["Authorization"] = `Bearer ${token}`;
  if (headerValue) {
      config.headers["UserID"] = headerValue.UserID || headerValue.StudentID;
      config.headers["TypeUserID"] = headerValue.TypeUserID;
      config.headers["IsOutside"] = headerValue.IsOutside;
      config.headers["Username"] = headerValue.Code || headerValue.StudentCode;
      config.headers["Fullname"] = btoa(unescape(encodeURIComponent(headerValue.Name || headerValue.StudentName)));
    }
  return config;
});

api.interceptors.response.use(
  (response) => (response && response.data ? response.data : response),
  async (error) => {
    const status = error.response?.status || 500;

    switch (status) {
      case 401: {
        const path = window.location.pathname;
        const publicPaths = ["/", "/login", "/register", "/forgot-password"];

        // ✅ Nếu đang ở trang public, bỏ qua
        if (publicPaths.includes(path)) {
          return Promise.reject(error);
        }

        window.location.href = "/login";
        return Promise.reject(error);
      }

      case 400: {
        return error.response.data; // Bad request
      }

      case 403: {
        return Promise.reject(error);
      }

      case 404: {
        return Promise.reject(error);
      }

      case 409: {
        return Promise.reject(error);
      }

      case 422: {
        return Promise.reject(error);
      }

      default: {
        return Promise.reject(error); // Lỗi server bất ngờ
      }
    }
  }
);

export const ApiManager = {
  get: async (url, { params } = {}) => {
    const res = await api.get(url, { params });
    return res.data;
  },
  post: async (url, body, query) => {
    // console.log('body', body);
    const res = await api.post(url, body, { params: query });
    return res;
  },
  put: async (url, data) => {
    const res = await api.put(url, data);
    return res.data;
  },
  delete: async (url, data) => {
    const res = await api.delete(url, { data });
    return res.data;
  },
  patch: async (url, data) => {
    const res = await api.patch(url, data);
    return res.data;
  },
};

export default ApiManager;
