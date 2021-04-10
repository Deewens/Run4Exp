import Api from './api';

const UserSessionApi = {
  getAll: async () => {
    return await Api.get("userSessions");
  },
  create: async (createModel) => {
    return await Api.post("userSessions", createModel);
  },
  self: async (challengeId) => {
    return await Api.get(`userSessions/self?challengeId=${challengeId}`);
  },
  selfAdvance: async (advanceModel) => {
    return await Api.post("userSessions/self/advance",advanceModel);
  },
  selfChoosePath: async (selfChoosePathModel) => {
    return await Api.post("userSessions/self/choosePath",selfChoosePathModel);
  },
};

export default UserSessionApi;
