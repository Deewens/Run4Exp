import {useQuery, UseQueryOptions} from "react-query";
import axios, {AxiosError} from "axios";
import {IPoint} from "@acrobatt";
import {Segment} from "../../entities/Segment";
import {PagedEntities} from "../../entities/PagedEntities";
import {Challenge} from "../../entities/Challenge";

export type SegmentApi = {
  id: number,
  name: string,
  coordinates: IPoint[]
  checkpointStartId: number
  checkpointEndId: number
  challengeId: number
  length: number
}

const getSegment = async (segmentId: number): Promise<Segment> => {
  return await axios.get<SegmentApi>(`/segments/${segmentId}`,)
    .then(response => {
      let data = response.data
      return new Segment({
        name: data.name,
        challengeId: data.challengeId,
        coordinates: data.coordinates,
        checkpointStartId: data.checkpointStartId,
        checkpointEndId: data.checkpointEndId,
        length: data.length,
      }, data.id)
    })
}

/**
 * Get a segment by its ID
 *
 * @param segmentId
 * @param options useQuery options
 */
export function useSegment(segmentId: number, options?: UseQueryOptions<Segment, AxiosError>) {
  return useQuery<Segment, AxiosError>(
    ['segments', segmentId],
    () => getSegment(segmentId),
    options
  )
}