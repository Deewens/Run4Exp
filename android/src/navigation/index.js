import React, { useContext } from 'react';
import SigninScreen from '../screens/SigninScreen';
import SignupScreen from '../screens/SignupScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Context } from '../context/AuthContext';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNav from "./DrawerNavigator";
import ChallengeMap from "../components/challenge/ChallengeMap";

const Stack = createStackNavigator();

export default () => {
  const { state } = useContext(Context);

  return (
    <>
      {state?.user ?
        <>
          <NavigationContainer>
            
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