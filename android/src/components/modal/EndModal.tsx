import React from 'react';
import { StyleSheet, Modal, View, TouchableOpacity, Text } from 'react-native';
import { DarkerTheme, LightTheme } from '../../styles/theme';
import { useTheme } from '../../styles';
import { MaterialIcons } from '@expo/vector-icons';
import { BaseModal, Button } from "../ui";


let createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: 2
    }
  });
}

type Props = {
  open: boolean;
  onExit: any;
};

export default ({ open, onExit }: Props) => {

  let styles = createStyles();

  return (
    <BaseModal
      open={open}
      hideExitIcon
      disallowBackgroundExit
      onExit={() => onExit()}>
      <Text style={styles.title}>Challenge Terminé !</Text>
      <Button onPress={() => onExit()} title='Super !' color='blue' center />
    </BaseModal>
  );
};
