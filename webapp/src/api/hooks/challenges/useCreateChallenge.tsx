import {useMutation} from "react-query";
import {ChallengeCreated, ChallengeCreate, User, ErrorApi} from "../../type";
import axios, {AxiosError, AxiosResponse} from "axios";
import {Challenge} from "../../entities/Challenge"

const createChallenge = async (challenge: ChallengeCreate): Promise<Challenge> => {
  return await axios.post<ChallengeCreate, AxiosResponse<ChallengeCreated>>(`/challenges`, challenge)
    .then(response => {
      return new Challenge({
        name: response.data.name,
        shortDescription: response.data.shortDescription,
        description: response.data.description,
        scale: response.data.scale,
      }, response.data.id)
    })
}

export default function useCreateChallenge() {
  return useMutation<Challenge, AxiosError<ErrorApi>, ChallengeCreate, unknown>((challenge: ChallengeCreate) => createChallenge(challenge))
}