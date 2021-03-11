import {useQuery} from "react-query";
import axios, {AxiosError} from "axios";
import {Point} from "@acrobatt";
import {Segment} from "./entities/Segment";

export type SegmentApi = {
  id: number,
  name: string,
  coordinates: Point[]
}

const getSegments = async (challengeId: number): Promise<Segment[]> => {
  return await axios.get<SegmentApi[]>(`/challenges/${challengeId}/segments`,)
    .then(response => {
      let segments: Segment[] = response.data.map(segmentApi => {
        return new Segment({
          name: segmentApi.name,
          challengeId: challengeId,
          coordinates: segmentApi.coordinates,
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