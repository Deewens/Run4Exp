import React, { useContext } from "react";
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import { NavigationContainer } from '@react-navigation/native';
import { Context } from './src/context/AuthContext';
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "./src/screens/AccountScreen";
import LocationScreen from "./src/screens/LocationScreen";
import ChallengesScreen from "./src/screens/ChallengesScreen";
import ChallengeScreen from "./src/screens/ChallengeScreen";
import PodometreScreen from "./src/screens/PodometreScreen";
import MapScreen from "./src/screens/MapScreen";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import UIScreen from "./src/screens/UIScreen";
import { Icon } from 'react-native-elements'
import { DarkerTheme, LightTheme } from './src/styles/theme'
import { useTheme } from "./src/styles"
import DrawerContent from "./src/components/DrawerContent"

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const HomeStackScreen = () => {

  const theme = useTheme();

  let selectedTheme = theme.mode === "dark" ? DarkerTheme : LightTheme;

  return (
    <Tab.Navigator
      tabBarOptions={{
        tabStyle: {
          backgroundColor: selectedTheme.colors.background,
          borderColor: selectedTheme.colors.background,
          // shadowColor: selectedTheme.colors.background,
        },
        safeAreaInset: { bottom: 0, top: 'never' }
      }}>
      <Tab.Screen
        name="Challenges"
        component={ChallengesScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => (<Icon size={30} name="home"></Icon>),
        }}
      />
    <Tab.Screen
        name="Challenge"
        component={ChallengeScreen}
      />
      <Tab.Screen
        name="Podometre"
        component={PodometreScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => (<Icon size={30} name="directions-walk"></Icon>)
        }}
      />
      <Tab.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => (<Icon size={30} name="map"></Icon>)
        }}
      />
      <Tab.Screen
        name="Gps"
        component={LocationScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => (<Icon size={30} name="location-on"></Icon>)
        }}
      />
      <Tab.Screen
        name="Ui"
        component={UIScreen}
        options={{

          headerShown: false,
          tabBarIcon: () => (<Icon size={30} name="layers"></Icon>),
          tabBarBadgeStyle: {
            backgroundColor: selectedTheme.colors.background,
            borderColor: selectedTheme.colors.background,
            // shadowColor: selectedTheme.colors.background,
          }
        }}
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
            <Drawer.Navigator
              drawerPosition="right"
              drawerContent={props => <DrawerContent {...props} />}>
              <Drawer.Screen
                name="Home"
                component={HomeStackScreen}
                options={{
                  headerShown: false,
                  drawerIcon: () => (<Icon size={23} name="home"></Icon>)
                }}
              />

              <Drawer.Screen
                name="Account"
                component={AccountScreen}
                options={{
                  headerShown: false,
                  drawerIcon: () => (<Icon size={23} name="account-circle"></Icon>)
                }}
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