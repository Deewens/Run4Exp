import React from 'react';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements'
import { DarkerTheme, LightTheme } from '../styles/theme'
import { useTheme } from '../styles';
import ChallengeNavigator from './ChallengeNavigator';

const Tab = createBottomTabNavigator();

export default () => {
  const theme = useTheme();

  let selectedTheme = theme.mode === "dark" ? DarkerTheme : LightTheme;

  return (
    <Tab.Navigator
      tabBarOptions={{
        tabStyle: {
          backgroundColor: selectedTheme.colors.background,
          borderColor: selectedTheme.colors.background,
          shadowColor: selectedTheme.colors.background,
          alignContent: 'center',

        },
        safeAreaInset: { bottom: 0, top: 'never' }
      }}>
      <Tab.Screen
        name="Challenges"
        component={ChallengeNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (<Icon size={30} name="directions-run" color={color}></Icon>),
        }}
      />
      <Tab.Screen
        name="Activités"
        component={ActivitiesScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (<Icon size={30} name="history" color={color}></Icon>),
        }}
      />
      {/* <Tab.Screen
        name="Challenge"
        component={ChallengeScreen}
      /> */}
      {/* <Tab.Screen
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
      /> */}
    </Tab.Navigator>)
}