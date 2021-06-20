import axios, {AxiosError} from "axios";
import {useQuery} from "react-query";
import {User} from "../../type";

const getUserSelf = async (): Promise<User> => {
  const { data } = await axios.get('/users/self')

  return data
}

/**
 * Get data on the logged in user
 *
 */
export default function useSelf() {
  return useQuery<User, AxiosError>('self', getUserSelf)
}