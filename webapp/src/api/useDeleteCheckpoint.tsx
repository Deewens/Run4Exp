import axios, {AxiosError} from "axios";
import {Checkpoint} from "./entities/Checkpoint";
import {useMutation, useQueryClient} from "react-query";
import {ErrorApi} from "./type";

const deleteCheckpoint = async (checkpointId: number) => {
  const {data} = await axios.delete(
    `/checkpoints/${checkpointId}`,
  )

  return data
}

export default function useDeleteCheckpoint() {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError<ErrorApi>, number>((checkpointId) => deleteCheckpoint(checkpointId))
}
