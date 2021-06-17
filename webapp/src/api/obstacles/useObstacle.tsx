import {useQuery, UseQueryOptions} from "react-query";
import axios, {AxiosError} from "axios";
import {IPoint} from "@acrobatt";
import Obstacle from "../entities/Obstacle";
import {Segment} from "../entities/Segment";

export type ObstacleApi = {
  id: number,
  position: number
  riddle: string
  response: string
  segmentId: number
}

const getObstacle = async (obstacleId: number): Promise<Obstacle> => {
  return await axios.get<ObstacleApi>(`/obstacles/${obstacleId}`,)
    .then(response => {
      const data = response.data
      return new Obstacle({
        riddle: data.riddle,
        segmentId: data.segmentId,
        response: data.response,
        position: data.position,
      }, data.id)
    })
}

export default function useObstacle(obstacleId: number, options?: UseQueryOptions<Obstacle, AxiosError>) {
  return useQuery<Obstacle, AxiosError>(
    ['obstacles', obstacleId],
    () => getObstacle(obstacleId)
  )
}