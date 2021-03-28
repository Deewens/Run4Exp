import React, { useContext, useEffect, useState } from "react";
import { Text } from "react-native";
import Spacer from "../components/Spacer";
import { Context as AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../components/Button"
import ThemedPage from "../components/ThemedPage";

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
    <ThemedPage title="Challenges" showUser={false}>
      <Text style={{ fontSize: 24 }}>Bienvenue {user?.firstName},</Text>
      <Spacer>
        <Button title="Déconnexion" onPress={signout} color="red"/>
      </Spacer>
    </ThemedPage>
  );
};

export default AccountScreen;
