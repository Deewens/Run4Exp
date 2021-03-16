import {useMutation} from "react-query";
import {ChallengeCreated, ChallengeCreate, User} from "./type";
import Api from "./fetchWrapper";
import axios, {AxiosResponse} from "axios";
import {Challenge} from "./entities/Challenge";

const createChallenge = async (challenge: ChallengeCreate): Promise<Challenge> => {
  return await axios.post<ChallengeCreate, AxiosResponse<ChallengeCreated>>(`/challenges`, challenge)
    .then(response => {
      return new Challenge({
        name: response.data.name,
        description: response.data.description,
        scale: response.data.scale,
      }, response.data.id)
    })
}

export default function useCreateChallenge() {
  return useMutation((challenge: ChallengeCreate) => createChallenge(challenge))
}