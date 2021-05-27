import {useQuery} from "react-query";
import axios, {AxiosError} from "axios";
import {UserSessionApi} from "@acrobatt";
import {ErrorApi} from "./type";
import {UserSession} from "./entities/UserSession";
import queryKeys from "./queryKeys";

const getUserSession = async (id: number) => {
  return await axios.get<UserSessionApi>(`/userSessions/${id}`)
    .then(response => {
      const userSession = response.data
      return new UserSession({
        advancement: userSession.advancement,
        currentSegmentId: userSession.currentSegmentId,
        isEnd: userSession.isEnd,
        isIntersection: userSession.isIntersection,
        obstacleId: userSession.obstacleId,
        totalAdvancement: userSession.totalAdvancement,
      }, userSession.id)
    })
}

export function useUserSession(id: number) {
  return useQuery<UserSession, AxiosError>(
    [queryKeys.USER_SESSION, id],
    () => getUserSession(id)
  )
}