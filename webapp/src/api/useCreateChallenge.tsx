import {useMutation} from "react-query";
import {ChallengeCreated, ChallengeCreate, User} from "./type";
import Api from "./fetchWrapper";
import axios from "axios";

const createChallenge = async (challenge: ChallengeCreate): Promise<ChallengeCreated> => {
  const { data } = await axios.post(
    `/challenges`, challenge
  );

  return data
}

export default function useCreateChallenge() {
  return useMutation((challenge: ChallengeCreate) => createChallenge(challenge))
}