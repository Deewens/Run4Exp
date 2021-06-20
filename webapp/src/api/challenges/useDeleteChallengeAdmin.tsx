import axios, {AxiosError} from "axios";
import {useMutation} from "react-query";
import {User} from "../type";

async function deleteChallengeAdmin(challengeId: number, admin: {adminId: number}) {
  const { data } = await axios.delete(`/challenges/${challengeId}/admin`, {data: admin})
  return data
}

/**
 * Remove an admin from an existing challenge
 */
export default function useDeleteChallengeAdmin() {
  return useMutation<User, AxiosError, {challengeId: number, adminId: number}>(
    (data) => deleteChallengeAdmin(data.challengeId, {adminId: data.adminId})
  )
}
