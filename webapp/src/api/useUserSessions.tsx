import {useQuery} from "react-query";
import axios, {AxiosError} from "axios";
import { UserSessionDetailless } from "./type";

const getUserSessions = async (challengeId: number): Promise<UserSessionDetailless[]> => {
  const { data } = await axios.get<UserSessionDetailless[]>(`/userSessions?challengeId=${challengeId}`)
  return data
}

export function useUserSessions(challengeId: number) {
  return useQuery<UserSessionDetailless[], AxiosError>(
    ['userSessions', challengeId],
    () => getUserSessions(challengeId)
  )
}