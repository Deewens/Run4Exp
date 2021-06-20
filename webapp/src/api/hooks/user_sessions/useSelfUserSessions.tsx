import axios, {AxiosError} from 'axios'
import {useQuery} from 'react-query'
import { UserSessionDetailless } from '../../type'
import queryKeys from "../../queryKeys";
import {UserSessionApi} from "@acrobatt";
import {EventSession, UserSession} from "../../entities/UserSession";
import {getUserAdvancement} from "../../../utils/helpers";

type QueryFilters = {
  finishedOnly?: boolean
  ongoingOnly?: boolean
}

async function getUserSessions(filters?: QueryFilters) {
  let url = `/userSessions/user/self`
  if (filters) {
    if (filters.ongoingOnly) {
      url = `/userSessions/user/self?ongoingOnly=${filters.ongoingOnly}`
    }

    if (filters.finishedOnly) {
      url = `/userSessions/user/self?finishedOnly=${filters.finishedOnly}`
    }
  }

  return await axios.get<UserSessionApi[]>(url)
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

export default function useSelfUserSessions(filters?: QueryFilters) {
  return useQuery<UserSession[], AxiosError>(
    [queryKeys.SELF_USER_SESSIONS, filters],
    () => getUserSessions(filters)
  )
}
