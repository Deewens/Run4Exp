import axios, {AxiosError} from "axios";
import {User} from "../type";
import {UseQueryOptions, useQuery} from "react-query";

async function getSuperAdmins() {
  const { data } =  await axios.get<User[]>('/users/superadmins')
  return data
}

/**
 * Get the list of super admins user
 *
 * @param options useQuery options
 */
export default function useSuperAdmins(options?: UseQueryOptions<User[], AxiosError>) {
  return useQuery<User[], AxiosError>(['superAdmins'], getSuperAdmins, options)
}