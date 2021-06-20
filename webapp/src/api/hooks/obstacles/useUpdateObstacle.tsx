import {useMutation, useQuery, useQueryClient} from "react-query";
import axios, {AxiosError, AxiosResponse} from "axios";
import Obstacle from "../../entities/Obstacle";
import {ObstacleApi} from "./useObstacles";
import {ErrorApi} from "../../type";
import {Checkpoint} from "../../entities/Checkpoint";

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

/**
 * Update an obstacle (PUT Query)
 *
 * Perform an optimistic update
 *
 */
export default function useUpdateObstacle() {
  const queryClient = useQueryClient()
  return useMutation<Obstacle, AxiosError<ErrorApi>, UpdateObstacle, {
    previousObstacles: Obstacle[] | undefined;
  }>(
    (obstacle: UpdateObstacle) => putObstacle(obstacle), {
      onMutate: async (variables) => {
        await queryClient.cancelQueries(['obstacles', variables.segmentId])

        const previousObstacles = queryClient.getQueryData<Obstacle[]>(['obstacles', variables.segmentId])

        if (previousObstacles) {
          const obstacleToUpdate = previousObstacles.find(obstacle => variables.id == obstacle.id)
          if (obstacleToUpdate) {
            const indexToUpdate = previousObstacles.findIndex(obstacle => variables.id == obstacle.id)
            previousObstacles[indexToUpdate] = obstacleToUpdate
            queryClient.setQueryData<Obstacle[]>(['obstacles', variables.segmentId], previousObstacles)
          }
        }

        return { previousObstacles }
      },
      onSettled: (variables) => {
        queryClient.invalidateQueries(['obstacles', variables?.attributes.segmentId])
      },
      onError(error, variables, context) {
        if (context?.previousObstacles) {
          queryClient.setQueryData<Obstacle[]>(['obstacles', variables.segmentId], context.previousObstacles)
        }
      }
    }
  )
}