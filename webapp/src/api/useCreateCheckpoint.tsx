import {useMutation, useQueryClient} from "react-query";
import {CheckpointApi, CheckpointsApi} from "./useCheckpoints";
import axios, {AxiosResponse} from 'axios'
import {Checkpoint} from "./entities/Checkpoint";
import {Segment} from "./entities/Segment";
import {SegmentApi} from "./useSegments";

type CheckpointCreate = {
  challengeId: number
  x: number
  y: number
  checkpointType: 0 | 1 | 2
  name: string
}

/*type CheckpointCreated = {
  id: number
  name: string
  x: number
  y: number
  challengeId: number
  segmentsStartsIds: number[]
  segmentsEndsIds: number[]
  checkpointType: 0 | 1 | 2
}*/

const postCheckpoint = async (data: CheckpointCreate): Promise<Checkpoint> => {
  return await axios.post<CheckpointCreate, AxiosResponse<CheckpointApi>>('/checkpoints', data)
  .then(response => {
    return new Checkpoint({
      name: response.data.name,
      challengeId: response.data.challengeId,
      checkpointType: response.data.checkpointType,
      segmentsStartsIds: response.data.segmentsStartsIds,
      segmentsEndsIds: response.data.segmentsEndsIds,
      coordinate: {x: response.data.x, y: response.data.y}
    }, response.data.id)
  })
}

export default function useCreateCheckpoint() {
  const queryClient = useQueryClient()

  return useMutation((data: CheckpointCreate) => postCheckpoint(data), {
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