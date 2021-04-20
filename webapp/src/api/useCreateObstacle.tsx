import {useMutation, useQuery, useQueryClient} from "react-query";
import axios, {AxiosError, AxiosResponse} from "axios";
import {Point} from "@acrobatt";
import {Obstacle} from "./entities/Obstacle";
import {ObstacleApi} from "./useObstacles";
import {ErrorApi} from "./type";
import {Segment} from "./entities/Segment";
import {Checkpoint} from "./entities/Checkpoint";

export type CreateObstacle = {
  position: number
  riddle: string
  segmentId: number
}

const postObstacle = async (obstacle: CreateObstacle): Promise<Obstacle> => {
  return await axios.post<CreateObstacle, AxiosResponse<ObstacleApi>>(`/obstacles`, obstacle)
  .then(response => {
    return new Obstacle({
      position: response.data.position,
      riddle: response.data.riddle,
      segmentId: response.data.segmentId,
    }, response.data.id)
  })
}

export default function useCreateObstacle() {
  const queryClient = useQueryClient()

  return useMutation<Obstacle, AxiosError<ErrorApi>, CreateObstacle, { previousObstacles: Obstacle[] | undefined }>(
    (obstacle: CreateObstacle) => postObstacle(obstacle), {
      onMutate: async (newObstacle: CreateObstacle) => {
        await queryClient.cancelQueries(['obstacles', newObstacle.segmentId])

        const previousObstacles = queryClient.getQueryData<Obstacle[]>(['obstacles', newObstacle.segmentId])
        let randomId = Math.random()
        if (previousObstacles) {
          queryClient.setQueryData<Obstacle[]>(['obstacles', newObstacle.segmentId], [
            ...previousObstacles,
            new Obstacle({
              position: newObstacle.position,
              riddle: newObstacle.riddle,
              segmentId: newObstacle.segmentId
            }, randomId)
          ])
        }

        return {previousObstacles}
      },
      onError(error, variables, context) {
        if (context?.previousObstacles) {
          queryClient.setQueryData<Obstacle[]>(['obstacles', variables.segmentId], context.previousObstacles)
        }
      },
      onSettled(variables) {
        queryClient.invalidateQueries(['obstacles', variables?.attributes.segmentId])
      }
    }
  )
}