import axios, {AxiosError, AxiosResponse} from 'axios'
import {useMutation} from "react-query";
import queryKeys from "../../queryKeys";
import {ErrorApi} from "../../type";

type DeleteUserParams = {
  password: string
}

async function deleteUser(params: DeleteUserParams) {
  const { data } =  await axios.delete('/users/self', {data: params})
  return data
}

/**
 * Delete the user itself
 *
 */
export default function useDeleteUserSelf() {
  return useMutation<any, AxiosError, DeleteUserParams>([queryKeys.DELETE_SELF_USER], (params: DeleteUserParams) => deleteUser(params))
}