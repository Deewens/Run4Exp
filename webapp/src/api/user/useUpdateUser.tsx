import {useMutation} from "react-query";
import axios, {AxiosError, AxiosResponse} from "axios";
import {ErrorApi, User} from "../type";

export type UpdateUser = {
  firstName: string
  name: string
  newPassword?: string
  newPasswordConfirmation?: string
  password: string
}

const putUser = async (user: UpdateUser): Promise<User> => {
  return await axios.put<UpdateUser, AxiosResponse<User>>(`/users/self`, user)
  .then(response => response.data)
}

/**
 * Update the logged in user by a PUT request
 */
export default function useUpdateUser() {
  return useMutation<User, AxiosError, UpdateUser>(
    (user: UpdateUser) => putUser(user)
  )
}