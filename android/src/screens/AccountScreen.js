import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet, SafeAreaView } from "react-native";
import Spacer from "../components/Spacer";
import { Context as AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../components/Button"

const AccountScreen = () => {
  const { signout } = useContext(AuthContext);

  let [user, setUser] = useState({
    firstName: "",
    name: "",
  });

  const readData = async () => {
    try {
      var userStore = await AsyncStorage.getItem("user");

      if (userStore !== undefined) {
        var userObj = JSON.parse(userStore);
        setUser(() => ({
          firstName: userObj.firstName,
        }));
      }
    } catch (e) {
      alert("Failed to fetch the data from storage");
    }
  };

  useEffect(() => {
    readData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 48 }}>Compte</Text>
      <Text style={{ fontSize: 24 }}>Bienvenue {user?.firstName},</Text>
      <Spacer>
        <Button title="Déconnexion" onPress={signout} color="red"/>
      </Spacer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
  },
});

export default AccountScreen;
