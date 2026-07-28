import axios from "axios";

let getToken;
export const setAuthTokenGetter = (getter) => { getToken = getter; };

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 30000,
});

api.interceptors.request.use(async (config) => {
  const token = getToken ? await getToken() : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
