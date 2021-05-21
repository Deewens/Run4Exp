import {useMutation, useQuery} from "react-query";
import {ErrorApi} from "./type";
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

export default function useUserAvatar() {
  return useQuery<string | null, AxiosError<ErrorApi>>(
    ['userAvatar'],
    () => getAvatar(), {
      onError(error) {
        console.log(error.toJSON())
        console.log(error.response)
      }
    }
  )
}