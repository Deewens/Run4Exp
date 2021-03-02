import {useMutation, useQuery} from "react-query";
import Api from "./fetchWrapper";
import {ErrorApi} from "./type";
import axios from "axios";

const getChallengeImage = async (challengeId: number): Promise<string | null> => {
  const { data } = await axios.get(`/challenges/` + challengeId + '/background', {
    responseType: "arraybuffer"
  });

  if (data.byteLength === 0) {
    return null
  } else {
    return URL.createObjectURL(new Blob([data], {type: 'image/png'}))
  }
}

export default function useChallengeImage(challengeId: number) {
  return useQuery<string | null, ErrorApi>(
    ['challengeImage', challengeId],
    () => getChallengeImage(challengeId)
  )
}