import {ChallengeUpdate, ErrorApi} from "./type";
import axios, {AxiosError, AxiosResponse} from "axios";
import {Challenge} from "./entities/Challenge";
import {useMutation, useQueryClient} from "react-query";
import {Checkpoint} from "./entities/Checkpoint";

type ChallengeUpdateResponse = {
  description: string
  id: number
  name: string
  scale: number
}

const putChallenge = async (data: ChallengeUpdate): Promise<Challenge> => {
  return await axios.put<ChallengeUpdate, AxiosResponse<ChallengeUpdateResponse>>(`/challenges/${data.id}`, data)
    .then(response => {
      return new Challenge({
        name: response.data.name,
        description: response.data.description,
        scale: response.data.scale,
      }, response.data.id)
    })
}

export default function useUpdateChallenge() {
  const queryClient = useQueryClient()
  return useMutation<Challenge, AxiosError<ErrorApi>, ChallengeUpdate>((data: ChallengeUpdate) => putChallenge(data), {
    onSuccess(data) {
      const previousData = queryClient.getQueryData<Challenge>(['challenges', data.id])
      queryClient.setQueryData<Challenge>(['challenges', data.id], new Challenge({
        ...previousData?.attributes,
        name: data.attributes.name,
        description: data.attributes.description,
        scale: data.attributes.scale,
      }, data.id))
    }
  });
}