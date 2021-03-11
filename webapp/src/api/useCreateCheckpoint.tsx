import {useMutation, QueryClient, useQueryClient} from "react-query";
import Api from "./fetchWrapper";
import {CheckpointsApi} from "./useCheckpoints";
import axios from 'axios'
import {Checkpoint} from "./entities/Checkpoint";

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

      const previousCheckpoints = queryClient.getQueryData<Checkpoint[]>(['checkpoints', newCheckpoint.challengeId])
      if (previousCheckpoints) {
        queryClient.setQueryData<Checkpoint[]>(['checkpoints', newCheckpoint.challengeId], [
          ...previousCheckpoints,
          new Checkpoint({
              name: newCheckpoint.name,
              coordinate: {x: newCheckpoint.x, y: newCheckpoint.y},
              checkpointType: newCheckpoint.checkpointType == 0
                ? "BEGIN"
                : (newCheckpoint.checkpointType == 2
                  ? "END"
                  : "MIDDLE"),
              segmentsEndsIds: [],
              segmentsStartsIds: [],
              challengeId: newCheckpoint.challengeId
            }, Math.random())
        ])
      }

      return { previousCheckpoints }

    },
    onError: (error, variables, context) => {
      if (context?.previousCheckpoints) {
        queryClient.setQueryData<Checkpoint[]>(['checkpoints', variables.challengeId], context.previousCheckpoints)
      }
    },
    onSettled: (variables) => {
      queryClient.invalidateQueries(['checkpoints'])
    },
  })
}