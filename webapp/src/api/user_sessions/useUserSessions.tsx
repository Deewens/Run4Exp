import {useQuery} from "react-query";
import axios, {AxiosError} from "axios";
import {EventSession, UserSession} from "../entities/UserSession";
import {UserSessionApi} from "@acrobatt";
import {getUserAdvancement} from "../../utils/helpers";

const getUserSessions = async (challengeId: number) => {
  return await axios.get<UserSessionApi[]>(`/userSessions?challengeId=${challengeId}`)
  .then(response => {
    return response.data.map(session => {
      // Convert timestamp to JS Date
      const events: EventSession[] = session.events.map(event => {
        const date = new Date(event.date)
        return {
          date,
          type: event.type,
          value: event.value,
        }
      })

      const advancement = getUserAdvancement(events)

      return new UserSession({
        challengeId: session.challengeId,
        userId: session.userId,
        advancement,
        events,
      }, session.id)
    })
  })
}

export function useUserSessions(challengeId: number) {
  return useQuery<UserSession[], AxiosError>(
    ['userSessions', challengeId],
    () => getUserSessions(challengeId)
  )
}