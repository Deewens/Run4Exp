import { Redirect, Route, RouteProps } from "react-router-dom";
import React from "react";
import { useAuth } from "../../../hooks/useAuth";
import axios from "axios";
import { useHistory } from "react-router";

interface ProtectedRouteProps extends RouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children, ...rest }: ProtectedRouteProps) => {
  const auth = useAuth()
  const history = useHistory()

  axios.interceptors.request.use(undefined, error => {
    if (error?.response?.status === 403) {
      history.push("/signin")
    }
    return Promise.reject(error)
  })

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default ProtectedRoute