import React, { useContext } from 'react';
import SigninScreen from '../screens/SigninScreen';
import SignupScreen from '../screens/SignupScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Context } from '../context/AuthContext';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNav from "./DrawerNavigator";
import ChallengeMap from "../components/challenge/ChallengeMap";
import Api from '../api/api';
import {navigationRef} from './RootNavigation'

const Stack = createStackNavigator();

let axiosContext = {};

Api.interceptors.response.use(undefined,
  (error) => {
    if(error?.response?.status == 403){
     axiosContext.signout()
    }
    return Promise.reject(error);
  }
);

export default () => {
  const { state,signout } = useContext(Context);

axiosContext = {signout};

return (
    <>
      {state?.user ?
        <>
          <NavigationContainer ref={navigationRef}>
            
            <Stack.Navigator initialRouteName="HomeSc">
              <Stack.Screen
                name="HomeSc"
                component={DrawerNav}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ChallengeMap"
                component={ChallengeMap}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </>
        :
        <NavigationContainer>

          <Stack.Navigator initialRouteName="Signin" drawerPosition="right">
            <Stack.Screen
              name="Signin"
              component={SigninScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      }
    </>
  );
};