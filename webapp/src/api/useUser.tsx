import axios, {AxiosError} from "axios";
import {useQuery} from "react-query";
import {User} from "./type";

async function getUser(userId: number): Promise<User> {
  const { data } = await axios.get(`/users/${userId}`)
  return data
}

export default function useUser(userId: number) {
  return useQuery<User, AxiosError>('user', () => getUser(userId))
}