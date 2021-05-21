import React, { useState } from 'react';
import { StyleSheet, Modal, View, TouchableOpacity, Text } from 'react-native';
import { DarkerTheme, LightTheme } from '../../styles/theme';
import { useTheme } from '../../styles';
import { MaterialIcons } from '@expo/vector-icons';
import { BaseModal, Button } from "../ui";
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TransportMeans } from "../../utils/transportMeans";

let createStyles = () => {
  return StyleSheet.create({
    modalListIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: "auto",
      marginRight: "auto",
    },
    modalIcon: {
      margin: 15,
    },
    title: {
      fontSize: 20,
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: 2
    }
  });
}

interface Callback {
  (transportMeans: TransportMeans): void
}

type Props = {
  open: boolean;
  onSelect: Callback;
  onExit: any;
};

export default ({ open, onSelect, onExit }: Props) => {

  let styles = createStyles();

  // let [choosenTransport, setChoosenTransport] = useState("none")

  return (
    <BaseModal
      open={open}
      onExit={() => onExit()}>
      <Text style={styles.title}>
        Choisissez un type de course
        </Text>
      <View style={styles.modalListIcon}>
        <TouchableOpacity onPressOut={() => onSelect('pedometer')}>
          <FontAwesome5 name="walking" size={45} color="black" style={styles.modalIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPressOut={() => onSelect('gps-foot')}>
          <FontAwesome5 name="running" size={45} color="black" style={styles.modalIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPressOut={() => onSelect('gps-bike')}>
          <MaterialCommunityIcons name="bike" size={45} color="black" style={styles.modalIcon} />
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
};
