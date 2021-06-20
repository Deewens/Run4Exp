import {useQuery} from "react-query";
import axios, {AxiosError} from "axios";
import {UserSessionApi} from "@acrobatt";
import {EventSession, UserSession} from "../../entities/UserSession";
import queryKeys from "../../queryKeys";
import {getUserAdvancement} from "../../../utils/helpers";

const getUserSession = async (id: number) => {
  return await axios.get<UserSessionApi>(`/userSessions/${id}`)
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
        advancement,
        events,
        registrationDate: new Date(userSession.inscriptionDate)
      }, userSession.id)
    })
}

export function useUserSession(id: number) {
  return useQuery<UserSession, AxiosError>(
    [queryKeys.USER_SESSION, id],
    () => getUserSession(id)
  )
}