import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

let Api = axios.create({
  baseURL: "http://192.168.0.200:8080/api",
  responseType: "json",
});

Api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(
  async (config) => {
    return config;
  },
  (error) => {
    console.error(error?.response?.data);
    return Promise.reject(error);
  }
);


export default Api;
