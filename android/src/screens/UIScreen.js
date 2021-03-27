import React from "react";
import { StyleSheet } from "react-native";
import { Text, ScrollView } from "react-native";
import Button from "../components/Button";
import TextInput from "../components/TextInput";

const UIScreen = () => {

  return (
    <ScrollView style={styles.scrollview}>
      <Text style={styles.title}>UI</Text>
      <Button title="Brand"/>
      <Button title="White" color="light"/>
      <Button title="Red" color="red"/>
      <Button title="Blue" color="blue"/>
      <Button title="Green" color="green"/>
      <Button icon="send" padding={10} width={50}/>
      <TextInput value="Test"/>
      <TextInput value="Test" secure={true}/>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  scrollview: {
    paddingHorizontal:10,
    paddingBottom: 10,
    paddingTop: 50,
  },
  title: {
    fontSize: 30
  }
});

export default UIScreen;
