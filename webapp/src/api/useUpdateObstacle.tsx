import {useMutation, useQuery} from "react-query";
import axios, {AxiosError, AxiosResponse} from "axios";
import {Obstacle} from "./entities/Obstacle";
import {ObstacleApi} from "./useObstacles";
import {ErrorApi} from "./type";

export type UpdateObstacle = {
  id: number
  position: number
  riddle: string
  segmentId: number
}

const putObstacle = async (obstacle: UpdateObstacle): Promise<Obstacle> => {
  return await axios.put<UpdateObstacle, AxiosResponse<ObstacleApi>>(`/obstacles/${obstacle.id}`, obstacle)
  .then(response => {
    return new Obstacle({
      position: response.data.position,
      riddle: response.data.riddle,
      segmentId: response.data.segmentId,
    }, response.data.id)
  })
}

export default function useUpdateObstacle() {
  return useMutation<Obstacle, AxiosError<ErrorApi>, UpdateObstacle, unknown>(
    (obstacle: UpdateObstacle) => putObstacle(obstacle)
  )
}