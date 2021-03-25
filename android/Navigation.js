import { StatusBar } from "expo-status-bar";
import React, { useContext } from "react";
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import { DarkerTheme } from './src/styles/theme'
import { NavigationContainer } from '@react-navigation/native';
import { Context } from './src/context/AuthContext';
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "./src/screens/AccountScreen";
import LocationScreen from "./src/screens/LocationScreen";
import ChallengesScreen from "./src/screens/ChallengesScreen";
import PodometreScreen from "./src/screens/PodometreScreen";
import { View } from "react-native";
import { StyleSheet } from "react-native";

const Stack = createStackNavigator();

export default () => {
  const { state } = useContext(Context);

  return (
    <NavigationContainer>

      {state?.user ?

        <Stack.Navigator initialRouteName="Challenges">
          <Stack.Screen
            name="Challenges"
            component={ChallengesScreen}
          />
          <Stack.Screen
            name="Podometre"
            component={PodometreScreen}
          />
          <Stack.Screen
            name="Gps"
            component={LocationScreen}
          />
          <Stack.Screen
            name="Account"
            component={AccountScreen}
          />
        </Stack.Navigator>

        :

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
        </Stack.Navigator>}

    </NavigationContainer>

  );
};