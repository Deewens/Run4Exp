import React, { useEffect } from 'react';
import { StyleSheet, Text, Vibration, View } from 'react-native';
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
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      flexDirection: 'row',
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
      <View style={styles.buttonsContainer}>
        <Button onPress={() => onPause()} title='Oui' loader={loading} color='blue' padding={2} width={110} />
        <Button onPress={() => onExit()} title='Continuer' padding={2} width={110} />
      </View>
    </BaseModal>
  );
};
