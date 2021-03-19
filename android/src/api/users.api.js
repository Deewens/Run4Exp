import Api from "./api";

const UserApi = {
  self: async () => {
    return await Api.get("users/self");
  },
  signin: async (signinModel) => {
    return await Api.post("users/signin", signinModel);
  },
  signup: async (signupModel) => {
    return await Api.post("users/signup", signupModel);
  },
};

export default UserApi;
