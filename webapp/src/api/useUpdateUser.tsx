import {useMutation} from "react-query";
import axios, {AxiosError, AxiosResponse} from "axios";
import {ErrorApi, User} from "./type";

export type UpdateUser = {
  email: string
  firstName: string
  name: string
  newPassword: string
  newPasswordConfirmation: string
  password: string
}

const putUser = async (user: UpdateUser): Promise<User> => {
  return await axios.put<UpdateUser, AxiosResponse<User>>(`/users/self`, user)
  .then(response => response.data)
}

export default function useUpdateUser() {
  return useMutation<User, AxiosError<ErrorApi>, UpdateUser>(
    (user: UpdateUser) => putUser(user)
  )
}