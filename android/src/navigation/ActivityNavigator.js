import React from 'react';
import ChallengesScreen from '../screens/ChallengesScreen';
import ChallengeScreen from '../screens/ChallengeScreen';
import { createStackNavigator } from '@react-navigation/stack';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createStackNavigator();


export default () => {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Activities"
                component={ActivitiesScreen}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>)
}