import {useMutation, useQueryClient} from "react-query"
import axios, {AxiosError} from "axios"
import {ErrorApi} from "../type"

const deleteObstacle = async (obstacleId: number) => {
  const { data } = await axios.delete(
    `/obstacles/${obstacleId}`
  )

  return data
}

export default function useDeleteObstacle() {
  const queryClient = useQueryClient()
  return useMutation<void, AxiosError<ErrorApi>, number>(
    (obstacleId: number) => deleteObstacle(obstacleId), {
      onSuccess() {
        queryClient.invalidateQueries(['obstacles'])
      }
    }
  )
}