import React, { useContext } from 'react';
import SigninScreen from '../screens/SigninScreen';
import SignupScreen from '../screens/SignupScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Context } from '../context/AuthContext';
import { createStackNavigator } from '@react-navigation/stack';
import AccountScreen from '../screens/AccountScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Icon } from 'react-native-elements'
import DrawerContent from '../components/DrawerContent';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

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
                component={TabNavigator}
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