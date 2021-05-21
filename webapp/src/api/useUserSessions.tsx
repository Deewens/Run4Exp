import {useQuery} from "react-query";
import axios, {AxiosError} from "axios";
import {UserSessionApi} from "@acrobatt";
import {UserSession} from "./entities/UserSession";

export type UserSessionsGet = {
  _embedded: UserSessionApi[]
}

const getUserSessions = async (challengeId: number): Promise<UserSession[]> => {
  return await axios.get<UserSessionsGet>(`/userSessions/self?challengeId=${challengeId}`)
  .then(response => {
    if (response.data._embedded) {
      return response.data._embedded.map(userSession => {
        return new UserSession({
          obstacleId: userSession.obstacleId,
          isIntersection: userSession.isIntersection,
          isEnd: userSession.isEnd,
          currentSegmentId: userSession.currentSegmentId,
          advancement: userSession.advancement,
          totalAdvancement: userSession.totalAdvancement,
        })
      })
    }
    return []
  })
}

export function useUserSessions(challengeId: number) {
  return useQuery<UserSession[], AxiosError>(
    ['userSessions', challengeId],
    () => getUserSessions(challengeId)
  )
}