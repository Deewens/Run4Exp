import * as React from 'react'
import {UserSessionApi} from "@acrobatt"
import {useMutation, useQueryClient} from "react-query";
import axios, {AxiosError, AxiosResponse} from "axios";
import {Segment} from "./entities/Segment";
import {ErrorApi} from "./type";
import {UserSession} from "./entities/UserSession";

type UserSessionCreate = {
  challengeId: number,
}

const postUserSession = async (data: UserSessionCreate): Promise<UserSession> => {
  return await axios.post<UserSessionCreate, AxiosResponse<UserSessionApi>>('/userSessions', data)
  .then(response => {
    return new UserSession({
      advancement: response.data.advancement,
      currentSegmentId: response.data.currentSegmentId,
      isEnd: response.data.isEnd,
      isIntersection: response.data.isIntersection,
      obstacleId: response.data.obstacleId,
      totalAdvancement: response.data.totalAdvancement,
    }, response.data.id)
  })
}

export default function useCreateUserSession() {
  const queryClient = useQueryClient()
  return useMutation<UserSession, AxiosError<ErrorApi>, UserSessionCreate>((data: UserSessionCreate) => postUserSession(data), {
    onSuccess(userSession, variables) {
      queryClient.invalidateQueries(['userSessions', variables.challengeId])
    }
  })

}