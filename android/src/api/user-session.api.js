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
  selfAdvance: async (id,advanceModel) => {
    return await Api.post(`userSessions/${id}/advance`, advanceModel);
  },
  selfChoosePath: async (id,selfChoosePathModel) => {
    return await Api.post(`userSessions/${id}/choosePath`, selfChoosePathModel);
  },
  startRun: async (id) => {
    return await Api.post(`userSessions/${id}/startRun`, {challengeId: 1});
  },
  getById: async (id) => {
    return await Api.get(`userSessions/${id}`);
  },
  passObstacle: async (id,obstacleToPassId) => {
    return await Api.post(`userSessions/${id}/passObstacle`,{
      obstacleToPassId
  });
  },
};

export default UserSessionApi;
