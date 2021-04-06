import Api from "./api";

const ChallengeApi = {
  pagedList: async (pageNumber) => {
    return await Api.get(`challenges?page=${pageNumber}&size=10&sort=id,desc`);
  },
  get: async (id) => {
    return await Api.get(`challenges/${id}`);
  },
  getDetail: async (id) => {
    return await Api.get(`challenges/${id}/detail`);
  },
  getBackground: async (id) => {
    return await Api.get(`challenges/${id}/background`, {responseType:"arraybuffer"});
  },
  getBackgroundBase64: async (id) => {
    return await Api.get(`challenges/${id}/background?base64=true`);
  },
};

export default ChallengeApi;
