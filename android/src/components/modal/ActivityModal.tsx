import React from 'react';
import { StyleSheet, Modal, View, TouchableOpacity, Text } from 'react-native';
import { DarkerTheme, LightTheme } from '../../styles/theme';
import { useTheme } from '../../styles';
import { MaterialIcons } from '@expo/vector-icons';
import { BaseModal, Button } from "../ui";
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

let createStyles = () => {
  return StyleSheet.create({
    modalListIcon: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    modalIcon: {
      margin: 15,
    },
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
      onExit={() => onExit()}>
      <View style={styles.modalListIcon}>
        <FontAwesome5 name="walking" size={65} color="black" style={styles.modalIcon} />
        <FontAwesome5 name="running" size={65} color="black" style={styles.modalIcon} />
        <MaterialCommunityIcons name="bike" size={65} color="black" style={styles.modalIcon} />
      </View>
    </BaseModal>
  );
};
