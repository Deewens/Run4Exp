import {useQuery} from "react-query";
import axios, {AxiosError} from "axios";
import {Point} from "@acrobatt";
import {Segment} from "./entities/Segment";

export type SegmentApi = {
  id: number,
  name: string,
  coordinates: Point[]
  endpointStartId: number
  endpointEndId: number
  challengeId: number
  length: number
}

const getSegments = async (challengeId: number): Promise<Segment[]> => {
  return await axios.get<SegmentApi[]>(`/segments?challengeId=${challengeId}`,)
    .then(response => {
      let segments: Segment[] = response.data.map(segmentApi => {
        return new Segment({
          name: segmentApi.name,
          challengeId: segmentApi.challengeId,
          coordinates: segmentApi.coordinates,
          endpointStartId: segmentApi.endpointStartId,
          endpointEndId: segmentApi.endpointEndId,
          length: segmentApi.length
        }, segmentApi.id)
      })

      return segments
    })
}

export function useSegments(challengeId: number) {
  return useQuery<Segment[], AxiosError>(
    ['segments', challengeId],
    () => getSegments(challengeId)
  )
}