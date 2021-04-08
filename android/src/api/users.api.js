import Api from './api';

const UserApi = {
  self: async () => {
    return await Api.get("users/self");
  },
  update: async (userModel) => {
    return await Api.put("users/self", userModel);
  },
  signin: async (signinModel) => {
    return await Api.post("users/signin", signinModel);
  },
  signup: async (signupModel) => {
    return await Api.post("users/signup", signupModel);
  },
  getAvatarBase64: async () => {
    return await Api.get(`users/avatar?base64=true`, {
      headers: {
        'Content-Type': 'text/plain'
      },
      responseType: 'text'
    });
  },
};

export default UserApi;
