import {useMutation, useQueryClient} from "react-query";
import axios, {AxiosError, AxiosResponse} from 'axios'
import {Checkpoint} from "../entities/Checkpoint";
import {ErrorApi} from "../type";
import {IPoint} from "@acrobatt";

type CheckpointUpdate = {
  id: number
  challengeId: number
  position: IPoint
  checkpointType: "BEGIN" | "MIDDLE" | "END"
  name: string
}

type CheckpointApi = {
  id: number
  name: string
  x: number
  y: number
  challengeId: number
  segmentsStartsIds: number[]
  segmentsEndsIds: number[]
  checkpointType: "BEGIN" | "MIDDLE" | "END"
}

const putCheckpoint = async (data: CheckpointUpdate): Promise<Checkpoint> => {
  return await axios.put<CheckpointUpdate, AxiosResponse<CheckpointApi>>(`/checkpoints/${data.id}`, data)
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

export default function useUpdateCheckpoint() {
  const queryClient = useQueryClient()

  return useMutation<Checkpoint, AxiosError<ErrorApi>, CheckpointUpdate, {
    previousCheckpoints: Checkpoint[] | undefined;
  }>((data: CheckpointUpdate) => putCheckpoint(data), {
    onMutate: async (updatedCheckpoint: CheckpointUpdate) => {
      await queryClient.cancelQueries(['checkpoints', updatedCheckpoint.challengeId])

      const previousCheckpoints = queryClient.getQueryData<Checkpoint[]>(['checkpoints', updatedCheckpoint.challengeId])


      if (previousCheckpoints) {
        const checkpointIndex = previousCheckpoints.findIndex(checkpoint => checkpoint.id === updatedCheckpoint.id)
        const checkpoint = previousCheckpoints.find(checkpoint => checkpoint.id === updatedCheckpoint.id)
        if (checkpointIndex && checkpoint) {
          checkpoint.attributes.coordinate.x = updatedCheckpoint.position.x
          checkpoint.attributes.coordinate.y = updatedCheckpoint.position.y
          previousCheckpoints[checkpointIndex] = checkpoint

          queryClient.setQueryData<Checkpoint[]>(['checkpoints', checkpoint.attributes.challengeId], previousCheckpoints)
        }
      }

      return { previousCheckpoints }

    },
    onError: (error, variables, context) => {
      if (context?.previousCheckpoints) {
        queryClient.setQueryData<Checkpoint[]>(['checkpoints', variables.challengeId], context.previousCheckpoints)
      }
    },
    onSettled: (variables) => {
      queryClient.invalidateQueries(['checkpoints', variables?.attributes.challengeId])
      queryClient.invalidateQueries(['segments', variables?.attributes.challengeId])
    },
  })
}