import * as React from 'react'
import {UserSessionApi} from "@acrobatt"
import {useMutation, useQueryClient} from "react-query";
import axios, {AxiosError, AxiosResponse} from "axios";
import {Segment} from "../entities/Segment";
import {ErrorApi} from "../type";
import {EventSession, UserSession} from "../entities/UserSession";
import {getUserAdvancement} from "../../utils/helpers";

type UserSessionCreate = {
  challengeId: number,
}

const postUserSession = async (data: UserSessionCreate): Promise<UserSession> => {
  return await axios.post<UserSessionCreate, AxiosResponse<UserSessionApi>>('/userSessions', data)
  .then(response => {
    const userSession = response.data
    // Convert timestamp to JS Date
    const events: EventSession[] = userSession.events.map(event => {
      const date = new Date(event.date)
      return {
        date,
        type: event.type,
        value: event.value,
      }
    })

    const advancement = getUserAdvancement(events)

    return new UserSession({
      userId: userSession.userId,
      challengeId: userSession.challengeId,
      events,
      advancement,
    }, userSession.id)
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