import {useMutation, useQueryClient} from "react-query";
import axios, {AxiosError, AxiosResponse} from 'axios'
import {ErrorApi} from "../../type";
import {IPoint} from "@acrobatt";
import {ISegment, Segment} from "../../entities/Segment";

type SegmentUpdate = {
  challengeId: number
  checkpointEndId: number
  checkpointStartId: number
  coordinates: IPoint[]
  name: string
  id: number
}

interface SegmentUpdated extends ISegment {
  id: number
}

/**
 * Update a segment by a PUT Query <br />
 * Perform an optimistic update
 *
 * @param data
 */
const putSegment = async (data: SegmentUpdate): Promise<Segment> => {
  return await axios.put<SegmentUpdate, AxiosResponse<SegmentUpdated>>(`/segments/${data.id}`, data)
  .then(response => {
    const data = response.data
    return new Segment({
      name: data.name,
      coordinates: data.coordinates,
      length: data.length,
      checkpointEndId: data.checkpointEndId,
      challengeId: data.challengeId,
      checkpointStartId: data.checkpointStartId
    }, response.data.id)
  })
}

export default function useUpdateSegment() {
  const queryClient = useQueryClient()

  return useMutation<Segment, AxiosError<ErrorApi>, SegmentUpdate, {
    previousSegments: Segment[] | undefined;
  }>((data: SegmentUpdate) => putSegment(data), {
    // onMutate: async (segmentUpdated: SegmentUpdate) => {
    //   await queryClient.cancelQueries(['segments', segmentUpdated.challengeId])
    //
    //   const previousSegments = queryClient.getQueryData<Segment[]>(['segments', segmentUpdated.challengeId])
    //
    //   if (previousSegments) {
    //     const segmentIndex = previousSegments.findIndex(segment => segment.id === segmentUpdated.id)
    //     const segmentToUpdate = previousSegments[segmentIndex]
    //     previousSegments[segmentIndex] = new Segment({
    //       name: segmentUpdated.name,
    //       checkpointStartId: segmentUpdated.checkpointStartId,
    //       checkpointEndId: segmentUpdated.checkpointEndId,
    //       challengeId: segmentUpdated.challengeId,
    //       length: segmentToUpdate.attributes.length,
    //       coordinates: segmentUpdated.coordinates,
    //     }, segmentUpdated.id)
    //
    //     queryClient.setQueryData<Segment[]>(['segments',  segmentUpdated.challengeId], previousSegments)
    //   }
    //
    //   return { previousSegments }
    //
    // },
    // onError: (error, variables, context) => {
    //   if (context?.previousSegments) {
    //     queryClient.setQueryData<Segment[]>(['segments', variables.challengeId], context.previousSegments)
    //   }
    // },
    onSettled: (variables) => {
      queryClient.invalidateQueries(['segments', variables?.attributes.challengeId])
    },
    onSuccess: (segment) => {
      console.log("On Succes Segment", segment)
    }
  })
}