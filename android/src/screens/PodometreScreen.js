import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AccountScreen = ({}) => {
  const { signout } = useContext(AuthContext);

  const readData = async () => {};

  useEffect(() => {
    readData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40 }}>Podometre</Text>
      <Text style={{ fontSize: 50 }}>0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
  },
});

export default AccountScreen;
