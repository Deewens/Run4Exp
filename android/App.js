import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SigninScreen from './src/screens/SigninScreen';
import SignupScreen from './src/screens/SignupScreen';
import AccountScreen from './src/screens/AccountScreen';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import {Provider as AuthProvider} from './src/context/AuthContext';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {setNavigator} from './src/navigationRef';
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';

const switchNavigator = createSwitchNavigator({
  ResolveAuth: ResolveAuthScreen,
  loginFlow: createStackNavigator({
    Signup: SignupScreen,
    Signin: SigninScreen
  }),
  mainFlow: createBottomTabNavigator({
      Account: AccountScreen
  })
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <AuthProvider>
      <App ref={(navigator) => {setNavigator(navigator)}} />
    </AuthProvider>
  )
};

// export default function App() {
//   const handlePress = () => console.log("pressed");

//   return (
//     <View style={styles.container}>
//       <Text onPress={(handlePress)}>OEZpp!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
