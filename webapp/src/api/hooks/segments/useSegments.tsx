import {useQuery} from "react-query";
import axios, {AxiosError} from "axios";
import {IPoint} from "@acrobatt";
import {Segment} from "../../entities/Segment";

export type SegmentApi = {
  id: number,
  name: string,
  coordinates: IPoint[]
  checkpointStartId: number
  checkpointEndId: number
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
          checkpointStartId: segmentApi.checkpointStartId,
          checkpointEndId: segmentApi.checkpointEndId,
          length: segmentApi.length
        }, segmentApi.id)
      })
      return segments
    })
}

/**
 * Get the list of segment attached to a challenge
 *
 * @param challengeId
 */
export function useSegments(challengeId: number) {
  return useQuery<Segment[], AxiosError>(
    ['segments', challengeId],
    () => getSegments(challengeId)
  )
}