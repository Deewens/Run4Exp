import React, { useContext } from "react";
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import { NavigationContainer } from '@react-navigation/native';
import { Context } from './src/context/AuthContext';
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "./src/screens/AccountScreen";
import LocationScreen from "./src/screens/LocationScreen";
import ChallengesScreen from "./src/screens/ChallengesScreen";
import PodometreScreen from "./src/screens/PodometreScreen";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import UIScreen from "./src/screens/UIScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const HomeStackScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Challenges"
        component={ChallengesScreen}
        options={{ headerShown: false }}
        tabBarIcon={({ tintColor }) => (
          <Icon name="ios-home" color={tintColor} size={25} />
        )
        }
      />
      <Tab.Screen
        name="Podometre"
        component={PodometreScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Gps"
        component={LocationScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Ui"
        component={UIScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>)
}


export default () => {
  const { state } = useContext(Context);

  return (
    <>
      {state?.user ?
        <>
          <NavigationContainer>

            <Drawer.Navigator >
              <Drawer.Screen
                name="Home"
                component={HomeStackScreen}
                options={{ headerShown: false }}
              />

              <Drawer.Screen
                name="Account"
                component={AccountScreen}
                options={{ headerShown: false }}
              />
            </Drawer.Navigator>
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