import {useQuery} from "react-query";
import axios, {AxiosError} from "axios";
import {Checkpoint} from "../../entities/Checkpoint";
import {IPoint} from "@acrobatt";

export type CheckpointsApi = {
  _embedded: {
    checkpointResponseModelList: CheckpointApi[]
  }
}

export type CheckpointApi = {
  id: number
  name: string
  position: IPoint,
  challengeId: number
  segmentsStartsIds: number[]
  segmentsEndsIds: number[]
  checkpointType: "BEGIN" | "MIDDLE" | "END"
}

const getCheckpoints = async (challengeId: number): Promise<Checkpoint[]> => {
  return await axios.get<CheckpointsApi>(`/checkpoints/?challengeId=${challengeId}`)
    .then(response => {
      if (response.data._embedded) {
        return response.data._embedded.checkpointResponseModelList.map(checkpointApi => {
          return new Checkpoint({
            challengeId: checkpointApi.challengeId,
            name: checkpointApi.name,
            coordinate: checkpointApi.position,
            segmentsStartsIds: checkpointApi.segmentsStartsIds,
            segmentsEndsIds: checkpointApi.segmentsEndsIds,
            checkpointType: checkpointApi.checkpointType
          }, checkpointApi.id)
        })
      }

      return []

    })
}

/**
 * Get the list of checkpoints linked to a challenge
 *
 * @param challengeId
 */
export function useCheckpoints(challengeId: number) {
  return useQuery<Checkpoint[], AxiosError>(
    ['checkpoints', challengeId],
    () => getCheckpoints(challengeId)
  )
}