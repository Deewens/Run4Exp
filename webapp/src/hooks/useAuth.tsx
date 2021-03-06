import React, {useState, useContext, useEffect} from "react";
import {User, UserWithToken} from "../api/type";
import axios, {AxiosError} from "axios";
import {unauthAxios} from "../api/axiosConfig";
import {CircularProgress} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

/**
 * Context used to manage and store user account data and functions (signin, signout, ...)
 */

type AuthContext = {
  user: User | null
  setUser:  React.Dispatch<React.SetStateAction<User | null>>
  setUpdateCurrentUser: React.Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
  signin: (email: string, password: string) => Promise<UserWithToken>
  signup: (name: string, firstName: string, email: string, password: string, passwordConfirmation: string) => Promise<User>
  signout: () => void
}

const AuthContext = React.createContext<AuthContext>({} as AuthContext);

type Props = {
  children: React.ReactNode
}

const useStyles = makeStyles({
  loading: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export const AuthProvider = ({children}: Props) => {
  const classes = useStyles()
  const auth = useProvideAuth();
  if (auth.isLoading) {
    return (
      <div className={classes.loading}>
        <CircularProgress/>
      </div>
    )
  } else {
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
  }
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(AuthContext)
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const [updateCurrentUser, setUpdateCurrentUser] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    axios.get<User>('/users/self')
      .then(res => res.data)
      .then(data => {
        setUser({
          id: data.id,
          email: data.email,
          firstName: data.firstName,
          name: data.name,
          superAdmin: data.superAdmin,
        })
        setIsLoading(false)
        setUpdateCurrentUser(false)
      })
      .catch((error: AxiosError) => {
        setIsLoading(false)
        setUpdateCurrentUser(false)
      })
  }, [updateCurrentUser])

  const signin = (email: string, password: string) => {
    return unauthAxios.post<UserWithToken>('/users/signin', {email, password})
      .then(response => response.data)
      .then(data => {
        localStorage.setItem('AUTH_TOKEN', data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        setUser({
          id: data.id,
          firstName: data.firstName,
          email: data.email,
          name: data.name,
          superAdmin: data.superAdmin,
        })

        return data
      })
  }

  const signup = (name: string, firstName: string, email: string, password: string, passwordConfirmation: string) => {
    return unauthAxios.post<User>('/users/signup', {name, firstName, email, password, passwordConfirmation})
      .then(response => response.data)
      .then(data => data)
  }

  const signout = () => {
    axios.defaults.headers.common['Authorization'] = ''
    if (localStorage.getItem('AUTH_TOKEN')) {
      localStorage.removeItem('AUTH_TOKEN')
    }

    setUser(null)
  }

  // Return the user object and auth methods
  return {
    user,
    setUser,
    setUpdateCurrentUser,
    isLoading,
    signup,
    signin,
    signout,
  };
}