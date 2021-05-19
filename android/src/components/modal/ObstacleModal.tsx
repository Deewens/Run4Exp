import React from 'react';
import { StyleSheet, Text } from 'react-native';
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
      marginBottom: 6
    },
    description: {
      fontSize: 14,
      marginBottom: 16
    },
  });
}

type Props = {
  open: boolean;
  onExit: any;
  obstacle: any;
};

export default ({ open, onExit, obstacle }: Props) => {

  let styles = createStyles();

  return (
    <BaseModal
      open={open}
      disallowBackgroundExit
      hideExitIcon
      onExit={() => onExit()}>
      <Text style={styles.title}>{obstacle.title}</Text>
      <Text style={styles.description}>{obstacle.description}</Text>
      <Button
        title='Ok'
        center
        onPress={() => onExit()}
      />
    </BaseModal>
  );
};
