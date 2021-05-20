import Api from './api';

const UserSessionApi = {
  getAll: async () => {
    return await Api.get("userSessions");
  },
  create: async (createModel) => {
    return await Api.post("userSessions", createModel);
  },
  self: async (challengeId) => {
    return await Api.get(`userSessions?challengeId=${challengeId}`);
  },
  selfByUser: async () => {
    return await Api.get(`userSessions/user/self`);
  },
  runs: async (id) => {
    return await Api.get(`userSessions/${id}/runs`);
  },
  selfAdvance: async (advanceModel) => {
    return await Api.post("userSessions/self/advance", advanceModel);
  },
  selfChoosePath: async (selfChoosePathModel) => {
    return await Api.post("userSessions/self/choosePath", selfChoosePathModel);
  },
};

export default UserSessionApi;
