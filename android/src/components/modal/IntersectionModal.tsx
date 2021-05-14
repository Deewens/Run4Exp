import React, { useState } from 'react';
import { StyleSheet, Modal, View, TouchableOpacity, Text } from 'react-native';
import { DarkerTheme, LightTheme } from '../../styles/theme';
import { useTheme } from '../../styles';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomModal, Button } from "../ui";


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
    pathList: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      overflow: 'scroll',

    }
  });
}

type Props = {
  open: boolean;
  intersections: Array<any>
  onExit: any;
  onHighLight: any;
};

export default ({ open, intersections, onExit, onHighLight }: Props) => {

  let styles = createStyles();

  const [selected, setSelected] = useState(null);

  let handleHighLight = (id) => {
    setSelected(id);
    onHighLight(id);
  }

  let handleExit = (selected) => {
    onExit(selected);
    onHighLight(selected);
  }

  return (
    <BottomModal
      open={open}
      disallowBackgroundExit
      onExit={() => handleExit(selected)}>

      {intersections ? (

        <>
          <Text style={styles.title}>Choisiez un chemin</Text>
          <Button onPress={() => handleExit(selected)} title='Suivre ce chemin' center />
          <View style={styles.pathList}>

            {
              intersections.map(function (intersection, key) {
                return <Button onPress={() => handleHighLight(intersection.id)} title={`${Math.round(intersection.length)}`} color={selected == intersection.id ? 'green' : 'gray'} width={60} key={key} />
              })
            }

          </View>
        </>

      ) : null}


    </BottomModal>
  );
};
