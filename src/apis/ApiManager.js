import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    responseType: "json",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_Token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

export const ApiManager = {
    get: async (url, { params } = {}) => {
        const res = await api.get(url, { params });
        return res.data;
    },
    post: async (url, body, query) => {
        const res = await api.post(url, body, { params: query });
        return res.data;
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
