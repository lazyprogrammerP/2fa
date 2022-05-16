import axios from "axios";

const Server = axios.create({
  baseURL: "http://localhost:8000",
});

Server.interceptors.request.use(
  (axiosConfig) => {
    axiosConfig["headers"]["X-Access-Token"] =
      localStorage.getItem("accessToken");
    return axiosConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Server.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location = "/auth/sign-in";
    }

    return Promise.reject(error);
  }
);

export default Server;
