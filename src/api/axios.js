import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4444",
});

instance.interceptors.request.use((configuration) => {
  configuration.headers.Authorization = localStorage.getItem("token");
  return configuration;
});

export default instance;
