import {useQuery, UseQueryOptions} from "react-query";
import axios, {AxiosError} from "axios";

export type Checkpoints = {
  _embedded: {
    checkpointResponseModelList: Checkpoint[]
  }
}

export type Checkpoint = {
  id: number
  name: string
  x: number
  y: number
  challengeId: number
  segmentsStartsIds: number | null
  segmentsEndsIds: number | null
  checkpointType: "BEGIN" | "MIDDLE" | "END"
}

const getCheckpoints = async (challengeId: number): Promise<Checkpoints> => {
  const { data } = await axios.get(
    `/checkpoints/?challengeId=${challengeId}`,
  );

  return data
}

export function useCheckpoints(challengeId: number) {
  return useQuery<Checkpoints, AxiosError>(
    ['checkpoints', challengeId],
    () => getCheckpoints(challengeId)
  )
}