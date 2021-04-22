import {useMutation, useQuery, useQueryClient} from "react-query";
import axios, {AxiosError, AxiosResponse} from "axios";
import Obstacle from "./entities/Obstacle";
import {ObstacleApi} from "./useObstacles";
import {ErrorApi} from "./type";

export type UpdateObstacle = {
  id: number
  position: number
  riddle: string
  response: string
  segmentId: number
}

const putObstacle = async (obstacle: UpdateObstacle): Promise<Obstacle> => {
  return await axios.put<UpdateObstacle, AxiosResponse<ObstacleApi>>(`/obstacles/${obstacle.id}`, obstacle)
  .then(response => {
    return new Obstacle({
      position: response.data.position,
      riddle: response.data.riddle,
      response: response.data.response,
      segmentId: response.data.segmentId,
    }, response.data.id)
  })
}

export default function useUpdateObstacle() {
  const queryClient = useQueryClient()
  return useMutation<Obstacle, AxiosError<ErrorApi>, UpdateObstacle, unknown>(
    (obstacle: UpdateObstacle) => putObstacle(obstacle), {
      onSuccess(data) {
        queryClient.refetchQueries(['obstacles', data?.attributes.segmentId])
      },
      onError(error) {
        console.log(error)
      }
    }
  )
}