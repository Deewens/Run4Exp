import {useMutation} from "react-query"
import axios, {AxiosError} from "axios"
import {ErrorApi} from "../type"

const deleteObstacle = async (obstacleId: number) => {
  const { data } = await axios.delete(
    `/obstacles/${obstacleId}`
  )

  return data
}

export default function useDeleteObstacle() {
  return useMutation<void, AxiosError<ErrorApi>, number>(
    (obstacleId: number) => deleteObstacle(obstacleId)
  )
}