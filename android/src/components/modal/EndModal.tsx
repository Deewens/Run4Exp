import React, { useEffect, useState } from 'react';
import { StyleSheet, Modal, View, TouchableOpacity, Text, Vibration } from 'react-native';
import { DarkerTheme, LightTheme } from '../../styles/theme';
import { useTheme } from '../../styles';
import { MaterialIcons } from '@expo/vector-icons';
import { BaseModal, Button } from "../ui";
import { eventType } from '../../utils/challengeStore.utils';
import EventToSendDatabase from '../../database/eventToSend.database';
import { Traker } from '../../utils/traker/types';
import { roundTwoDecimal } from '../../utils/math.utils';


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
  challengeStore: any;
  traker: Traker;
};

export default ({ open, onExit, challengeStore, traker }: Props) => {

  let styles = createStyles();

  let [loading, setLoading] = useState(true);

  let addEvents = async () => {

    try {

      let eventToSendDatabase = EventToSendDatabase();

      let advance = roundTwoDecimal(
        traker.getMeters() -
        challengeStore.progress.resumeProgress
      );

      await eventToSendDatabase.addEvent(
        eventType.ADVANCE,
        advance,
        challengeStore.map.userSession.id
      );

      await eventToSendDatabase.addEvent(
        eventType.END,
        "",
        challengeStore.map.userSession.id
      );

      setLoading(false)

    } catch (error) {
      console.log(error)
    }


  }

  useEffect(() => {
    if (open) {
      Vibration.vibrate();
      addEvents();
    }
  }, [open])

  return (
    <BaseModal
      open={open}
      hideExitIcon
      disallowBackgroundExit
      onExit={() => onExit()}>
      <Text style={styles.title}>Challenge Terminé !</Text>
      <Button onPress={() => onExit()} title='Super !' color='blue' center loader={loading} />
    </BaseModal>
  );
};
