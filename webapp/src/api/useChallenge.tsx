import {useQuery, UseQueryOptions} from "react-query";
import axios, {AxiosError} from 'axios'
import {Challenge} from "./entities/Challenge";
import {PagedEntities} from "./entities/PagedEntities";
import {ChallengeApi} from "./type";

async function fetchChallenge(id: number): Promise<Challenge> {
  return await axios.get<ChallengeApi>(`/challenges/${id}`)
  .then(response => {
    console.log(response)
    return new Challenge(
      {
        name: response.data.name,
        description: response.data.description,
        shortDescription: response.data.shortDescription,
        administratorsId: response.data.administratorsId
      }, response.data.id)
  })
}

export default function useChallenge(id: number) {
  return useQuery<Challenge, AxiosError>(
    ['challenges', id],
    () => fetchChallenge(id),
  )
}