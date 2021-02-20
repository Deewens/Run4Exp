import createDataContext from "./createDataContxt";
import UserApi from "../api/users.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../navigationRef";
import { Header } from "react-native/Libraries/NewAppScreen";
import { useState } from "react";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signin":
      return { errorMessage: "", token: action.payload };
    case "user":
      return { errorMessage: "", user: action.payload };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "signout":
      return { token: null, errorMessage: "" };
    default:
      return state;
  }
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    dispatch({ type: "signin", payload: token });

    await UserApi.self()
      .then(async (response) => {
        if (response.status == 403) {
          throw Error("Token expired");
        }

        await AsyncStorage.removeItem("user");

        await AsyncStorage.setItem(
          "user",
          JSON.stringify({
            ...response?.data,
          })
        );

        navigate("Account");
      })
      .catch(async () => {
        await AsyncStorage.removeItem("token");

        navigate("Signin");
      });
  } else {
    navigate("Signup");
  }
};

const signup = (dispatch) => async ({
  name,
  firstName,
  email,
  password,
  passwordConfirmation,
}) => {
  try {
    const response = await UserApi.signup({
      name,
      firstName,
      email,
      password,
      passwordConfirmation,
    });
    navigate("Signin");
  } catch (error) {
    dispatch({
      type: "add_error",
      payload: "Une erreur s'est produite lors de l'inscription",
    });
  }
};

const signin = (dispatch) => async ({ email, password }) => {
  try {
    const response = await UserApi.signin({
      email,
      password,
    });

    await AsyncStorage.setItem("token", response.headers.authorization);

    dispatch({ type: "signin", payload: response.headers.authorization });
    var value = JSON.stringify({
      ...response?.data,
    });

    await AsyncStorage.removeItem("user");
    await AsyncStorage.setItem("user", value).then(() => {
      navigate("Account");
    });
  } catch (error) {
    dispatch({
      type: "add_error",
      payload: "Une erreur s'est produite lors de la connexion",
    });
  }
};

const signout = (dispatch) => async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");

  dispatch({ type: "signout" });

  navigate("loginFlow");
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signup,
    signin,
    signout,
    clearErrorMessage,
    tryLocalSignin,
  },
  { token: null, errorMessage: "" }
);
