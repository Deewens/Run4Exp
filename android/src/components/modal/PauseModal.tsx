import React, { useEffect } from 'react';
import { StyleSheet, Text, Vibration } from 'react-native';
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
  onPause: any;
  loading: boolean
};

export default ({ open, onExit, onPause, loading }: Props) => {

  let styles = createStyles();

  useEffect(() => {
    if (open) {
      Vibration.vibrate();
    }
  }, [open])

  return (
    <BaseModal
      open={open}
      onExit={() => onExit()}>
      <Text style={styles.title}>Voulez-vous mettre en pause et reprendre plus tard ?</Text>
      <Button onPress={() => onExit()} title='Oui' color='blue' />
      <Button onPress={() => onPause()} title='Pause' loader={loading} />
    </BaseModal>
  );
};
