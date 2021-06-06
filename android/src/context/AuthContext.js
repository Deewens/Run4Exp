import createDataContext from './createDataContext';
import UserApi from '../api/users.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserDatabase from '../database/user.database'

const authReducer = (state, action) => {
  switch (action.type) {
    case "signin":
      return { errorMessage: "", token: action.payload };
    case "user":
      return { errorMessage: "", user: action.payload };
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
  let userDatabase = UserDatabase();

  await userDatabase.initTable();

  var defaultUser = await userDatabase.first();

  if (defaultUser) {

    AsyncStorage.setItem("token",defaultUser.token);

    await UserApi.self().catch(
      async (err) => {
        if(err.response.status === 403){
          await userDatabase.deleteAll();
          await AsyncStorage.clear();
        }else{
          dispatch({ type: "user", payload: defaultUser });
        }
      }
    );

    dispatch({ type: "user", payload: defaultUser });
  }

  // if (token) {
  //   dispatch({ type: "signin", payload: token });

  //   await UserApi.self()
  //     .then(async (response) => {
  //       if (response.status == 403) {
  //         throw Error("Token expired");
  //       }

  //       await AsyncStorage.removeItem("user");

  //       await AsyncStorage.setItem(
  //         "user",
  //         JSON.stringify({
  //           ...response?.data,
  //         })
  //       );

  //       dispatch({ type: "user", payload: response?.data });
  //     })
  //     .catch(async (error) => {
  //       await AsyncStorage.removeItem("token");
  //     });
  // }

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
  // const navigation = useNavigation();
  try {
    await UserApi.signup({
      name,
      firstName,
      email,
      password,
      passwordConfirmation,
    });

    // navigation.navigate()

  } catch (error) {
    // dispatch({
    //   type: "add_error",
    //   payload: error.response.data.errors[0],
    // });
  }

  // navigation.goBack();
};

const signin = (dispatch) => async ({ email, password }) => {

  const userDatabase = UserDatabase();

  await userDatabase.initTable();

  await userDatabase.deleteAll();

  const response = await UserApi.signin({
    email,
    password,
  }).catch(e => {
    console.error("Signin : ",e)
  });

  await AsyncStorage.setItem("token", response.headers.authorization);

  // dispatch({ type: "signin", payload: response.headers.authorization });
  var value = JSON.stringify({
    ...response?.data,
  });

  // await AsyncStorage.removeItem("user");

  let addUser = {
    id: response?.data?.id,
    name: response?.data?.name,
    firstName: response?.data?.firstName,
    email: response?.data?.email,
    token: response.headers.authorization,
  };
  
  await userDatabase.addData(addUser);
  console.log(await userDatabase.first())
  
  await AsyncStorage.setItem("user", value);

  await dispatch({ type: "user", payload: addUser });
  
};

const signout = (dispatch) => async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");

  const userDatabase = UserDatabase();

  await userDatabase.deleteAll();

  dispatch({ type: "signout" });
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signup,
    signin,
    signout,
    tryLocalSignin,
    getToken,
  },
  { token: null, errorMessage: "" }
);
