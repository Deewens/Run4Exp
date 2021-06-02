import axios, {AxiosError} from 'axios'
import {UserSessionRun} from "./type";
import {useQuery} from "react-query";

async function getUserSessionRuns(userSessionId: number) {
  const { data } = await axios.get<UserSessionRun[]>(`/userSessions/${userSessionId}/runs`)
  return data
}

export default function useUserSessionRuns(userSessionId: number) {
  return useQuery<UserSessionRun[], AxiosError>(
    ['userSessionRuns', userSessionId],
    () => getUserSessionRuns(userSessionId)
  )
}