import createDataContext from './createDataContext';
import UserApi from '../api/users.api';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

        dispatch({ type: "user", payload: response?.data });
      })
      .catch(async (error) => {
        await AsyncStorage.removeItem("token");
      });
  }
};

const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

const signup = (dispatch) => async ({
  name,
  firstName,
  email,
  password,
  passwordConfirmation,
}) => {
  try {
    await UserApi.signup({
      name,
      firstName,
      email,
      password,
      passwordConfirmation,
    });
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
      dispatch({ type: "user", payload: response?.data });
    });
  } catch (error) {
    dispatch({
      type: "add_error",
      payload: "Une erreur s'est produite lors de la connexion",
    });
  }
};

const update = (dispatch) => async ({ firstName, name, email, password, newPassword, newPasswordConfirmation }) => {
  console.log({ firstName, name, email, password, newPassword, newPasswordConfirmation });
  try {
    const response = await UserApi.update({
      firstName: firstName,
      name: name,
      email: email,
      password: password,
      newPassword: newPassword,
      newPasswordConfirmation: newPasswordConfirmation,
    });

    dispatch({ type: "user", payload: response.headers.authorization });
    var value = JSON.stringify({
      ...response?.data,
    });

    await AsyncStorage.removeItem("user");
    await AsyncStorage.setItem("user", value).then(() => {
      dispatch({ type: "user", payload: response?.data });
    });
  } catch (error) {
    dispatch({
      type: "add_error",
      payload: error,
    });
  }
};


const signout = (dispatch) => async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");

  dispatch({ type: "signout" });
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signup,
    signin,
    signout,
    update,
    clearErrorMessage,
    tryLocalSignin,
    getToken,
  },
  { token: null, errorMessage: "" }
);
