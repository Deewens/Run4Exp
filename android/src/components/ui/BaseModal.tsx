import React from 'react';
import { StyleSheet, Modal, View, TouchableOpacity } from 'react-native';
import { DarkerTheme, LightTheme } from '../../styles/theme';
import { useTheme } from '../../styles';
import { MaterialIcons } from '@expo/vector-icons';


let createStyles = (selectedTheme, style) => {
  return StyleSheet.create({
    modalBackground: {
      flex: 1,
      backgroundColor: "#000000aa",
    },
    modalContent: {
      marginTop: 200,
      borderRadius: 10,
      padding: 25,
      margin: 20,
      backgroundColor: 'white',
      ...style
    },
    modalChildren: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'baseline',
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
  hideExitIcon?: boolean;
  disallowBackgroundExit?: boolean;
  style?: any;
};

export default ({ open, onExit, children, hideExitIcon, disallowBackgroundExit, style }: Props) => {

  const theme = useTheme();
  let selectedTheme = theme.mode === "dark" ? DarkerTheme : LightTheme;

  hideExitIcon = hideExitIcon === undefined ? false : hideExitIcon;
  disallowBackgroundExit = disallowBackgroundExit === undefined ? false : disallowBackgroundExit;

  let styles = createStyles(selectedTheme, style);

  let backgroudExit = () => {
    if (!disallowBackgroundExit) {
      onExit()
    }
  }

  return (
    <Modal visible={open}
      animationType='fade'
      style={styles.modalBackground}
      transparent={true}
      statusBarTranslucent={true}
      hardwareAccelerated={true}
      onRequestClose={() => backgroudExit()}>
      <TouchableOpacity style={styles.modalBackground} onPress={() => backgroudExit()} activeOpacity={1}>
        <TouchableOpacity style={styles.modalContent} touchSoundDisabled={true} activeOpacity={1}>

          <View
            style={styles.modalHeader}>
            {
              hideExitIcon ? null :
                (<MaterialIcons
                  name='close'
                  size={24}
                  onPress={() => onExit()}
                  style={styles.closeIcon}
                />)
            }
          </View>


          <View style={styles.modalChildren}>
            {children}
          </View>

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
