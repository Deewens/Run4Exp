import {Challenge} from "../entities/Challenge";
import axios, {AxiosError, AxiosResponse} from 'axios'
import {ChallengeApi, ErrorApi} from "../type";
import {useMutation, useQueryClient} from "react-query";

async function putPublishChallenge(challengeId: number): Promise<Challenge> {
  return await axios.put<null, AxiosResponse<ChallengeApi>>(`/challenges/${challengeId}/publish`)
    .then(response => {
      const challenge = response.data
      return new Challenge({
        name: challenge.name,
        description: challenge.description,
        checkpointsId: challenge.checkpointsId,
        segmentsId: challenge.segmentsId,
        scale: challenge.scale,
        shortDescription: challenge.shortDescription,
        administratorsId: challenge.administratorsId,
        published: challenge.published,
      }, challenge.id)
    })
}

export default function usePublishChallenge() {
  const queryClient = useQueryClient()
  return useMutation<Challenge, AxiosError<ErrorApi>, number>((challengeId: number) => putPublishChallenge(challengeId), {
    onSuccess(challenge) {
      queryClient.invalidateQueries(['challenges', challenge.id])
    }
  })
}