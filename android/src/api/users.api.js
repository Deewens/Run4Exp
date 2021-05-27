import Api from './api';
import axios from 'axios';
import {apiUrl} from '../utils/const';

let NoAuthApi = axios.create({
  baseURL: apiUrl,
  responseType: "json",
});

const UserApi = {
  self: async () => {
    return Api.get("users/self");
  },
  update: async (userModel) => {
    return Api.put("users/self", userModel);
  },
  signin: async (signinModel) => {
    return NoAuthApi.post("users/signin", signinModel);
  },
  signup: async (signupModel) => {
    return NoAuthApi.post("users/signup", signupModel);
  },
  getAvatarBase64: async () => {
    return Api.get(`users/avatar?base64=true`, {
      headers: {
        'Content-Type': 'text/plain'
      },
      responseType: 'text'
    });
  },
};

export default UserApi;
