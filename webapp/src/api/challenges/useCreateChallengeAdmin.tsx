import axios, {AxiosError} from "axios";
import {useMutation} from "react-query";
import {User} from "../type";

async function putChallengeAdmin(challengeId: number, admin: {adminId: number}) {
  const { data } = await axios.put<User>(`/challenges/${challengeId}/admin`, admin)
  return data
}

export default function useCreateChallengeAdmin(challengeId: number) {
  return useMutation<User, AxiosError, {adminId: number}>((data) => putChallengeAdmin(challengeId, data))
}