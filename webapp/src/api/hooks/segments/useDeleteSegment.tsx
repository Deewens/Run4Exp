import axios, {AxiosError} from "axios";
import {useMutation} from "react-query";
import {ErrorApi} from "../../type";

const deleteSegment = async (checkpointId: number) => {
  const {data} = await axios.delete(
    `/segments/${checkpointId}`,
  )

  return data
}

export default function useDeleteSegment() {
  return useMutation<void, AxiosError<ErrorApi>, number>((checkpointId) => deleteSegment(checkpointId))
}
