import * as React from 'react';
import { useHistory } from 'react-router';
import {ReactNode, useContext, useEffect, useState} from "react";
import {User, UserSignIn} from "@acrobatt";
import Api from "../../api/api";
import {AuthContextType} from '@acrobatt';

const AuthContext = React.createContext<AuthContextType | null>(null);

type Props = {
  children: ReactNode
}

export const AuthProvider = ({children}: Props) => {
  const history = useHistory();
  const [user, setUser] = useState<User | null>(null);

  const [userCheck, setUserCheck] = useState(false);

  useEffect(() => {
    setUserCheck(false);
    if (localStorage.getItem("authorization_token")) {
      Api.getSignedInUser()
        .then(
          data => {
            setUser(data);
            setUserCheck(true);
          })
        .catch(error => {
          console.error(error);
          setUserCheck(true);
        });
    } else {
      setUserCheck(true)
    }
  }, [])

  const signin = (user: UserSignIn) => {
    return Api.signin(user)
      .then(data => {
        localStorage.setItem("authorization_token", data.token);
        setUser(data)
        history.push("/");
      })
  }

  const signup = (user: User) => {
    return Api.signup(user)
      .then(
        () => {
          history.push("/signin");
        }
      )
  }

  /*const signout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("selectedHouseshareId");
    setUser(null);
    setSelectedHouseshare(null);
    history.push("/");
  }*/

  return (
    !userCheck ? <p>Retrieving last session...</p> :
      <AuthContext.Provider value={{user, signup, signin, /*signout*/}}>
        {children}
      </AuthContext.Provider>

)
}

export const useAuth = () => useContext(AuthContext);
