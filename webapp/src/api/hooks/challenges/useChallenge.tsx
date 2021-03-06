import {useQuery} from "react-query";
import axios, {AxiosError} from 'axios'
import {Challenge} from "../../entities/Challenge";
import {ChallengeApi} from "../../type";

async function fetchChallenge(id: number): Promise<Challenge> {
  return await axios.get<ChallengeApi>(`/challenges/${id}`)
  .then(response => {
    return new Challenge({
      name: response.data.name,
      description: response.data.description,
      scale: response.data.scale,
      shortDescription: response.data.shortDescription,
      administratorsId: response.data.administratorsId,
      segmentsId: response.data.segmentsId,
      checkpointsId: response.data.checkpointsId,
      published: response.data.published,
      creatorId: response.data.creatorId,
    }, response.data.id)
  })
}

/**
 * Send a GET query to get a challenge by its ID.
 *
 * @param id
 */
export default function useChallenge(id: number) {
  return useQuery<Challenge, AxiosError>(
    ['challenges', id],
    () => fetchChallenge(id),
  )
}