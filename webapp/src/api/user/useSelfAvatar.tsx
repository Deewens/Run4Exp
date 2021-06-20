import {useMutation, useQuery} from "react-query";
import {ErrorApi} from "../type";
import axios, {AxiosError} from "axios";

const getAvatar = async (): Promise<string | null> => {
  const { data } = await axios.get(`/users/avatar`, {
    responseType: "arraybuffer"
  });

  if (data.byteLength === 0) {
    return null
  } else {
    return URL.createObjectURL(new Blob([data], {type: 'image/jpeg'}))
  }
}

/**
 * Get the avatar of the current logged in user
 */
export default function useSelfAvatar() {
  return useQuery<string | null, AxiosError<ErrorApi>>(
    ['userAvatar'],
    () => getAvatar(),
  )
}