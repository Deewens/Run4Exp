import React from 'react';
import ChallengesScreen from '../screens/ChallengesScreen';
import ChallengeScreen from '../screens/ChallengeScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();


export default () => {

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Challenges"
        component={ChallengesScreen}
        options={{
          headerShown:false
        }}
      />
      <Stack.Screen
        name="Challenge"
        component={ChallengeScreen}
        options={{
          headerShown:false
        }}
      />
    </Stack.Navigator>)
}