import {useMutation, useQuery} from "react-query";
import {ErrorApi} from "./type";
import axios, {AxiosError} from "axios";

const getChallengeImage = async (challengeId: number): Promise<string | null> => {
  const { data } = await axios.get(`/challenges/` + challengeId + '/background', {
    responseType: "arraybuffer"
  });

  // if (data.byteLength === 0) {
  //   return null
  // } else {
  //   return URL.createObjectURL(new Blob([data], {type: 'image/jpeg'}))
  // }

  return URL.createObjectURL(new Blob([data], {type: 'image/jpeg'}))
}

export default function useChallengeImage(challengeId: number) {
  return useQuery<string | null, AxiosError>(
    ['challengeImage', challengeId],
    () => getChallengeImage(challengeId),
    {
      retry: false,
    }
  )
}