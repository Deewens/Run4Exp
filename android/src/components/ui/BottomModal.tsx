import React from 'react';
import { StyleSheet, Modal, View, TouchableOpacity } from 'react-native';
import { DarkerTheme, LightTheme } from '../../styles/theme';
import { useTheme } from '../../styles';
import { MaterialIcons } from '@expo/vector-icons';


let createStyles = (selectedTheme, style) => {
  return StyleSheet.create({
    modalBackground: {
      flex: 1,
      // backgroundColor: "#000000aa",
      justifyContent: 'flex-end'
    },
    modalContent: {
      borderTopStartRadius: 10,
      borderTopRightRadius: 10,
      padding: 25,
      marginTop: 20,
      bottom: 0,
      backgroundColor: 'white',
      marginBottom: 0,
      ...style
    },
    modalChildren: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'baseline',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.00,

      elevation: 24,
    },
    closeIcon: {
      right: 0,
      marginRight: 0,
      display: 'flex',
      padding: 4,
    },
    modalHeader: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row-reverse',
    }
  });
}

type Props = {
  open: boolean;
  onExit: any;
  children: any;
  disallowBackgroundExit?: boolean;
  style?: any;
};

export default ({ open, onExit, children, disallowBackgroundExit, style }: Props) => {

  const theme = useTheme();
  let selectedTheme = theme.mode === "dark" ? DarkerTheme : LightTheme;

  disallowBackgroundExit = disallowBackgroundExit === undefined ? false : disallowBackgroundExit;

  let styles = createStyles(selectedTheme, style);

  let backgroudExit = () => {
    if (!disallowBackgroundExit) {
      onExit()
    }
  }

  return (
    <Modal visible={open}
      animationType='slide'
      style={styles.modalBackground}
      transparent={true}
      statusBarTranslucent={true}
      hardwareAccelerated={true}
      onRequestClose={() => backgroudExit()}>
      <TouchableOpacity style={styles.modalBackground} onPress={() => backgroudExit()} activeOpacity={1}>
        <TouchableOpacity style={styles.modalContent} touchSoundDisabled={true} activeOpacity={1}>

          <View style={styles.modalChildren}>
            {children}
          </View>

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
