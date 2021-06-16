import Api from './api';

const UserSessionApi = {
  getAll: async () => {
    return Api.get("userSessions");
  },
  create: async (createModel) => {
    return Api.post("userSessions", createModel);
  },
  self: async (challengeId) => {
    return Api.get(`userSessions?challengeId=${challengeId}`);
  },
  selfByUser: async () => {
    return Api.get(`userSessions/user/self`);
  },
  runs: async (id) => {
    return Api.get(`userSessions/${id}/runs`);
  },
  selfAdvance: async (id,advanceModel) => {
    return Api.post(`userSessions/${id}/advance`, advanceModel);
  },
  selfChoosePath: async (id,selfChoosePathModel) => {
    return Api.post(`userSessions/${id}/choosePath`, selfChoosePathModel);
  },
  startRun: async (id) => {
    return Api.post(`userSessions/${id}/startRun`, {challengeId: 1});
  },
  getById: async (id) => {
    return Api.get(`userSessions/${id}`);
  },
  passObstacle: async (id,obstacleToPassId) => {
    return Api.post(`userSessions/${id}/passObstacle`,{
      obstacleToPassId
  });
  },
  bulkEvents: async (id,events) => {
    return Api.post(`userSessions/${id}/events`,{events})
  }
};

export default UserSessionApi;
