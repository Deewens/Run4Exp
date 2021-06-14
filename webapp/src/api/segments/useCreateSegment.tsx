import * as React from 'react'
import {IPoint} from "@acrobatt";
import {useMutation, useQueryClient} from "react-query";
import axios, {AxiosError, AxiosResponse} from "axios";
import {CheckpointsApi} from "../checkpoints/useCheckpoints";
import {SegmentApi} from "./useSegments";
import {Segment} from "../entities/Segment";
import {Checkpoint} from "../entities/Checkpoint";
import {ErrorApi} from "../type";

type SegmentCreate = {
  challengeId: number
  coordinates: IPoint[]
  checkpointStartId: number
  checkpointEndId: number
  name: string
  length: number
}

const postSegment = async (data: SegmentCreate): Promise<Segment> => {
  return await axios.post<SegmentCreate, AxiosResponse<SegmentApi>>('/segments', data)
  .then(response => {
    return new Segment({
      name: response.data.name,
      challengeId: response.data.challengeId,
      coordinates: response.data.coordinates,
      checkpointStartId: response.data.checkpointStartId,
      checkpointEndId: response.data.checkpointEndId,
      length: response.data.length
    }, response.data.id)
  })
}

export default function useCreateSegment() {
  const queryClient = useQueryClient()

  return useMutation<Segment, AxiosError<ErrorApi>, SegmentCreate, {
    previousSegments: Segment[] | undefined;
  }>((data: SegmentCreate) => postSegment(data), {
    onMutate: async (newSegment: SegmentCreate) => {
      await queryClient.cancelQueries(['segments', newSegment.challengeId])

      const previousSegments = queryClient.getQueryData<Segment[]>(['segments', newSegment.challengeId])
      //console.log(previousSegments)
      let randomSegmentId = Math.random()
      if (previousSegments) {
        queryClient.setQueryData<Segment[]>(['segments', newSegment.challengeId], [
          ...previousSegments,
          new Segment({
            name: newSegment.name,
            coordinates: newSegment.coordinates,
            challengeId: newSegment.challengeId
          }, randomSegmentId)
        ])
      }

      const previousCheckpoints = queryClient.getQueryData<Checkpoint[]>(['checkpoints', newSegment.challengeId])

      if (previousCheckpoints) {
        const newCheckpoints = previousCheckpoints.map(checkpoint => {
          if (checkpoint.id == newSegment.checkpointStartId) {
            return new Checkpoint({
              ...checkpoint.attributes,
              segmentsStartsIds: [...checkpoint.attributes.segmentsStartsIds, randomSegmentId]
            }, checkpoint.id)
          } else if (checkpoint.id == newSegment.checkpointEndId) {
            return new Checkpoint({
              ...checkpoint.attributes,
              segmentsEndsIds: [...checkpoint.attributes.segmentsEndsIds, randomSegmentId]
            }, checkpoint.id)
          }

          return checkpoint
        })

        queryClient.setQueryData<Checkpoint[]>(['checkpoints', newSegment.challengeId], newCheckpoints)
      }

      return {previousSegments}
    },
    onError: (error, variables, context) => {
      console.log(error.response)
      if (context?.previousSegments) {
        queryClient.setQueryData<Segment[]>(['segments', variables.challengeId], context.previousSegments)
      }
    },
    onSettled: (variables) => {
      queryClient.invalidateQueries(['checkpoints', variables?.attributes.challengeId])
      queryClient.invalidateQueries(['segments', variables?.attributes.challengeId])
    },

  })
}