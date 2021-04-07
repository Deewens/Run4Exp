
import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Title, Drawer, Text, TouchableRipple, Switch } from 'react-native-paper';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Context as AuthContext } from '../context/AuthContext';
import { useTheme } from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '../utils/const';
import { Button } from './ui';
import { DarkerTheme, LightTheme } from '../styles/theme'
import { Theme } from '@react-navigation/native';

let createStyles = (selectedTheme: Theme): any => {

  return StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
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
    }
  });
};

export default function DrawerContent(props: any) {

  const theme = useTheme();

  let selectedTheme = theme.mode === "dark" ? DarkerTheme : LightTheme;

  let styles = createStyles(selectedTheme);

  const { signout, state } = useContext(AuthContext);

  const [token, setToken] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("token").then((data: any) => {
      setToken(data);
    });
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: selectedTheme.colors.background }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              <View style={{ marginRight: 15, flexDirection: 'column' }}>
                <Title style={styles.title}>{state.user?.firstName} {state.user?.name}</Title>
              </View>
              <Avatar.Image
                source={{
                  uri: `${apiUrl}/users/avatar`,
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }}
                size={60}
              />
            </View>
          </View>

          <Drawer.Section title="Preferences" style={styles.textColor}>
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