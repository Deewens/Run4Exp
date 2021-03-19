import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import Spacer from "../components/Spacer";
import { Context as AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AccountScreen = (props) => {
  return (
    <View>
      <Text style={{ fontSize: 20 }}>{props.challenge.name}</Text>
    </View>
  );
};

export default AccountScreen;
