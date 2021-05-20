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
  return await axios.post<UserSessionCreate, AxiosResponse<UserSessionApi>>('/segments', data)
  .then(response => {
    return new UserSession({
      advancement: response.data.advancement,
      currentSegmentId: response.data.currentSegmentId,
      isEnd: response.data.isEnd,
      isIntersection: response.data.isIntersection,
      obstacleId: response.data.obstacleId,
      totalAdvancement: response.data.totalAdvancement,
    })
  })
}

export default function useCreateUserSession() {
  return useMutation<UserSession, AxiosError<ErrorApi>, UserSessionCreate, {
    previousUserSession: Segment[] | undefined;
  }>((data: UserSessionCreate) => postUserSession(data))

}