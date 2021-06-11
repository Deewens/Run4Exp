import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements'
import { DarkerTheme, LightTheme } from '../styles/theme'
import { useTheme } from '../styles';
import ChallengeNavigator from './ChallengeNavigator';
import ActivityNavigator from './ActivityNavigator';

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
        name="Dashboard"
        component={ActivityNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (<Icon size={30} name="dashboard" color={color}></Icon>),
        }}
      />
      <Tab.Screen
        name="Mes courses"
        component={ActivityNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (<Icon size={30} name="call-split" color={color}></Icon>),
        }}
      />
      <Tab.Screen
        name="Challenges"
        component={ChallengeNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (<Icon size={30} name="directions-walk" color={color}></Icon>),
        }}
      />
      {/* <Tab.Screen
        name="BDD"
        component={DataBaseScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (<Icon size={30} name="call-split" color={color}></Icon>),
        }}
      /> */}
    </Tab.Navigator>)
}