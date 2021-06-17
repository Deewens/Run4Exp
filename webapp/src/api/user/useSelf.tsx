import axios, {AxiosError} from "axios";
import {useQuery} from "react-query";
import {User} from "../type";

const getUserSelf = async (): Promise<User> => {
  const { data } = await axios.get('/users/self')

  return data
}

export default function useSelf() {
  return useQuery<User, AxiosError>('self', getUserSelf)
}