import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Drawer, Text, TouchableRipple, Switch } from 'react-native-paper';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Context as AuthContext } from '../context/AuthContext';
import { useTheme } from '../styles';
import { Button, Avatar } from './ui';
import { DarkerTheme, LightTheme } from '../styles/theme'
import { Theme } from '@react-navigation/native';
import UserApi from '../api/users.api';
import NavLink from '../components/NavLink';
import AccountScreen from '../screens/AccountScreen';
import SignupScreen from '../screens/SignupScreen';
import { useNavigation } from '@react-navigation/native';
import { blue100 } from 'react-native-paper/lib/typescript/styles/colors';

let createStyles = (selectedTheme: Theme): any => {

  return StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 16,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
      color: selectedTheme.colors.text,
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
      color: selectedTheme.colors.text,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
      marginBottom: 15,
      borderTopColor: '#f4f4f4',
      borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    textColor: {
      color: selectedTheme.colors.text,
    },
    menu: {
      color: "#2D9BF0",
      fontWeight: "bold",
    }
  });
};

export default function DrawerContent(props: any) {

  const theme = useTheme();

  let selectedTheme = theme.mode === "dark" ? DarkerTheme : LightTheme;

  let styles = createStyles(selectedTheme);

  const { signout, state } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, backgroundColor: selectedTheme.colors.background }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent} >
          <View style={styles.userInfoSection} >
            <View style={{ flexDirection: 'row', marginTop: 15 }} >
              <View style={{ marginRight: 15, flexDirection: 'column' }} >
                <Title style={styles.title}>{state.user?.firstName} {state.user?.name}</Title>
              </View>
              {/* <Avatar.Image
                source={{
                  uri: `${apiUrl}/users/avatar`,
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }}
                size={60}
              /> */}
              <Avatar size={60} />
            </View>
          </View>

          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              <Text style={styles.menu} onPress={() => props.navigation.navigate('Account')}>Modifier mes informations</Text>
            </View>
          </View>

          <Drawer.Section title="Préférences" style={styles.textColor}>
            <TouchableRipple onPress={() => { theme.setMode(theme.mode === "dark" ? "light" : "dark") }}>
              <View style={styles.preference}>
                <Text style={styles.textColor}>Dark Theme</Text>
                <View pointerEvents="none">
                  <Switch value={theme.mode === "dark"} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <Button
          center
          color="red"
          title="Déconnexion"
          onPress={() => { signout() }}
        />
      </Drawer.Section>
    </View>
  );
}