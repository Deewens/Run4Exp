import axios, {AxiosError} from "axios";
import {useMutation} from "react-query";
import {User} from "../type";

async function deleteChallengeAdmin(challengeId: number, admin: {adminId: number}) {
  const { data } = await axios.delete(`/challenges/${challengeId}/admin`, {data: admin})
  return data
}

export default function useDeleteChallengeAdmin() {
  return useMutation<User, AxiosError, {challengeId: number, adminId: number}>(
    (data) => deleteChallengeAdmin(data.challengeId, {adminId: data.adminId})
  )
}
