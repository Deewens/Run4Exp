import {makeStyles} from "@material-ui/core/styles";
import {Redirect, Route, RouteProps} from "react-router-dom";
import React from "react";
import {CircularProgress} from "@material-ui/core";
import {useAuth} from "../../../hooks/useAuth";

interface ProtectedRouteProps extends RouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({children, ...rest}: ProtectedRouteProps) => {
  const auth = useAuth()

  return (
    <Route
      {...rest}
      render={({location}) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: {from: location}
            }}
          />
        )
      }
    />
  );
}

export default ProtectedRoute