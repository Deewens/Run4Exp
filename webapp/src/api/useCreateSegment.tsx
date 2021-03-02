import * as React from 'react'
import {Point} from "@acrobatt";
import {useMutation, useQueryClient} from "react-query";
import axios from "axios";
import {Checkpoints} from "./useCheckpoints";
import {Segment} from "./useSegments";

type SegmentCreate = {
  challengeId: number
  coordinates: Point[]
  endpointStartId: number
  endpointEndId: number
  name: string
  length: number
}

export default function useCreateSegment() {
  const queryClient = useQueryClient()

  return useMutation((data: SegmentCreate) => axios.post<SegmentCreate>('/segments', data), {
    onMutate: async (newSegment: SegmentCreate) => {
      await queryClient.cancelQueries(['segments', newSegment.challengeId])

      const previousSegments = queryClient.getQueryData<Segment[]>(['segments', newSegment.challengeId])
      //console.log(previousSegments)
      if (previousSegments) {
        queryClient.setQueryData<Segment[]>(['segments', newSegment.challengeId], [
          ...previousSegments,
          {
            id: Math.random(),
            name: newSegment.name,
            coordinates: newSegment.coordinates
          }
        ])
      }

      return {previousSegments}
    },
    onError: (error, variables, context) => {
      if (context?.previousSegments) {
        queryClient.setQueryData<Segment[]>(['segments', variables.challengeId], context.previousSegments)
      }
    },
    onSettled: (variables) => {
      queryClient.invalidateQueries(['segments'])
    },

  })
}