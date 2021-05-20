import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from '../components/DrawerContent'
import AccountScreen from '../screens/AccountScreen';
import { Icon } from 'react-native-elements'
import TabNavigator from './TabNavigator';

const Drawer = createDrawerNavigator();


export default () => {

  return (
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
      </Drawer.Navigator>)
}