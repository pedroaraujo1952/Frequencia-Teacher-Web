import axios from "axios";

const api = axios.create({ baseUrl: "" });

api.interceptors.request.use(async config => {
  config.headers.Authorization = `key=${process.env.REACT_APP_FIREBASE_FCM_KEY}`;
  return config;
});

export default api;
