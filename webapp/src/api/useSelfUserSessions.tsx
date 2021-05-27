import axios, {AxiosError} from 'axios'
import {useQuery} from 'react-query'
import { UserSessionDetailless } from './type'
import queryKeys from "./queryKeys";

async function getUserSessions() {
  const { data } = await axios.get<UserSessionDetailless[]>(`/userSessions/user/self`)
  return data
}

export default function useSelfUserSessions() {
  return useQuery<UserSessionDetailless[], AxiosError>(
    [queryKeys.SELF_USER_SESSIONS],
    () => getUserSessions(),
    {
      onSuccess(success) {
        console.log(success)
      },
      onError(error) {
        console.log(error.response)
      }
    }
  )
}
