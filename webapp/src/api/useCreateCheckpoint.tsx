import {useMutation, QueryClient, useQueryClient} from "react-query";
import Api from "./fetchWrapper";
import {Checkpoints} from "./useCheckpoints";
import axios from 'axios'

type CheckpointCreate = {
  challengeId: number
  x: number
  y: number
  checkpointType: 0 | 1 | 2
  name: string
}

type CheckpointCreated = {
  id: number
  name: string
  x: number
  y: number
  challengeId: number
  segmentsStartsIds: number
  segmentsEndsIds: number
  checkpointType: 0 | 1 | 2
}

export default function useCreateCheckpoint() {
  const queryClient = useQueryClient()

  return useMutation((data: CheckpointCreate) =>
    axios.post<CheckpointCreate, CheckpointCreated>('/checkpoints', data), {
    onMutate: async (newCheckpoint: CheckpointCreate) => {
      await queryClient.cancelQueries(['checkpoints', newCheckpoint.challengeId])

      const previousCheckpoints = queryClient.getQueryData<Checkpoints>(['checkpoints', newCheckpoint.challengeId])
      if (previousCheckpoints) {
        queryClient.setQueryData<Checkpoints>(['checkpoints', newCheckpoint.challengeId], {
          ...previousCheckpoints,
          _embedded: {
            checkpointResponseModelList: [
              {
                id: Math.random(),
                challengeId: newCheckpoint.challengeId,
                segmentsStartsIds: null,
                segmentsEndsIds: null,
                name: newCheckpoint.name,
                checkpointType: "MIDDLE",
                x: newCheckpoint.x,
                y: newCheckpoint.y
              }]
          }
        })
      }

      return { previousCheckpoints }

    },
    onError: (error, variables, context) => {
      if (context?.previousCheckpoints) {
        queryClient.setQueryData<Checkpoints>(['checkpoints', variables.challengeId], context.previousCheckpoints)
      }
    },
    onSettled: (variables) => {
      queryClient.invalidateQueries(['checkpoints'])
    },
  })
}