import {useQuery} from "react-query";
import axios, {AxiosError} from "axios";

const getChallengeImage = async (challengeId: number): Promise<string | null> => {
  const { data } = await axios.get(`/challenges/` + challengeId + '/background', {
    responseType: "arraybuffer"
  });

  return URL.createObjectURL(new Blob([data], {type: 'image/jpeg'}))
}

/**
 * Send a GET query to get the background of a challenge with its id
 *
 * @param challengeId
 */
export default function useChallengeImage(challengeId: number) {
  return useQuery<string | null, AxiosError>(
    ['challengeImage', challengeId],
    () => getChallengeImage(challengeId),
    {
      retry: false,
    }
  )
}