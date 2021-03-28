import React from "react";
import { StyleSheet } from "react-native";
import { Text, ScrollView } from "react-native";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import ThemedPage from "../components/ThemedPage";

const UIScreen = ({navigation}) => {

  return (
    <ThemedPage title="UI" onUserPress={() => navigation.openDrawer()}>
      <Button title="Brand"/>
      <Button title="White" color="light"/>
      <Button title="Red" color="red"/>
      <Button title="Blue" color="blue"/>
      <Button title="Green" color="green"/>
      <Button icon="send" padding={10} width={50}/>
      <TextInput value="Test"/>
      <TextInput value="Test" secure={true}/>
    </ThemedPage>
  );
};

export default UIScreen;
