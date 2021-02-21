import React, {useState, useContext} from "react";
import {User} from "@acrobatt";
import Api from "./../../api/fetchWrapper"
import {UserSignup, UserSignin, UserWithtoken} from "../../api/type";
import {useMutation, UseMutationResult} from "react-query";

type AuthContext = {
  user: User | null
  useSignin: () => UseMutationResult<UserWithtoken, unknown, UserSignin, unknown>
  useSignup: () =>  UseMutationResult<User, unknown, UserSignup, unknown>
}

const AuthContext = React.createContext<AuthContext>({} as AuthContext);

type Props = {
  children: React.ReactNode
}

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export const AuthProvider = ({children}: Props) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(AuthContext)
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState<User | null>(null);

  const useSignin = () => {
    return useMutation(
      (data: UserSignin) => Api.post<UserWithtoken>('/users/signin', data),
      {
        onSuccess: (data) => {
          localStorage.setItem("AUTH_TOKEN", data.token);
          setUser(data);
        }
      }
    )
  }

  const useSignup = () => {
    return useMutation(
      (data: UserSignup) => Api.post<User>('/users/signup', data),
    )
  }


  // Return the user object and auth methods
  return {
    user,
    useSignup,
    useSignin,
  };
}