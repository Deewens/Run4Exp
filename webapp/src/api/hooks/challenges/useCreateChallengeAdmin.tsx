import axios, {AxiosError} from "axios";
import {useMutation} from "react-query";
import {User} from "../../type";

async function putChallengeAdmin(challengeId: number, admin: {adminId: number}) {
  const { data } = await axios.put<User>(`/challenges/${challengeId}/admin`, admin)
  return data
}

/**
 * Add an admin to an existing challenge
 */
export default function useCreateChallengeAdmin() {
  return useMutation<User, AxiosError, {challengeId: number, adminId: number}>(
    (data) => putChallengeAdmin(data.challengeId, {adminId: data.adminId})
  )
}