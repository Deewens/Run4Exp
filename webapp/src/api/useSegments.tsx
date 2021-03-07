import {useQuery} from "react-query";
import axios, {AxiosError} from "axios";
import {Point} from "@acrobatt";

export type Segment = {
  id: number,
  name: string,
  coordinates: Point[]
}

const getSegments = async (challengeId: number): Promise<Segment[]> => {
  const { data } = await axios.get(
    `/challenges/${challengeId}/segments`,
  );

  return data
}

export function useSegments(challengeId: number) {
  return useQuery<Segment[], AxiosError>(
    ['segments', challengeId],
    () => getSegments(challengeId)
  )
}