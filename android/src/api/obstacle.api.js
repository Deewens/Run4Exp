import Api from './api';

const ObstacleApi = {
  getBySegementId: async (segementId) => {
    return await Api.get(`obstacles?segmentId=${segementId}`);
  },
};

export default ObstacleApi;
