import {useQuery, UseQueryOptions} from "react-query";
import {ChallengeApi, ErrorApi, SortApi} from "./type";
import axios, {AxiosError} from 'axios'

async function fetchChallenge(page = 0, sort?: SortApi[]): Promise<ChallengeApi> {
  let key = ['challenges', page]
  let input = `/challenges?page=${page}`
  sort?.forEach((value) => {
    input = input + `&sort=${value.field},${value.order}`
    key.push(value.field, value.order)
  })

  const { data } = await axios.get(input)
  return data
}

export default function useChallenges(page = 0, sort?: SortApi[]) {
  return useQuery<ChallengeApi, AxiosError>(
    ['challenges', page, sort],
    () => fetchChallenge(page, sort),
  )
}