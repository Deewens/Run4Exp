import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {apiUrl} from '../utils/const';

let Api = axios.create({
  baseURL: apiUrl,
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
    console.error(error?.response);
    return Promise.reject(error);
  }
);


export default Api;
