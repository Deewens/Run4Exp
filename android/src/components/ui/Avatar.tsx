
import React, { useEffect, useState } from 'react';
import { Avatar } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import UserApi from '../../api/users.api';
import { useTheme } from '../../styles';

let createStyles = (style?: any): any => {

  return StyleSheet.create({
    avatar: {
      backgroundColor: "transparent",
      ...style,
    },
  });
};

type Props = {
  size: number;
  onPress?: () => void;
  style?: any;
};

export default ({ size, onPress, style }: Props) => {

  let styles = createStyles(style);

  const theme = useTheme();

  const userWhite = require("../../../assets/user-white.png");
  const userBlack = require("../../../assets/user-black.png");

  const [base64, setBase64] = useState(null);

  let userDefault = theme.mode === "dark" ? userWhite : userBlack;

  let imageSource = !base64 ?
    userDefault
    :
    { uri: `data:image/jpeg;base64, ${base64}` };

  let loadData = async () => {
    try {
      let response = await UserApi.getAvatarBase64();

      if (response.status != 204) {
        setBase64(response.data);
      }
    } catch {
    }
  }

  useEffect(() => {
    loadData();
  }, [])

  return (
    <Avatar.Image
      source={imageSource}
      size={size}
      style={styles.avatar}
      onTouchEnd={onPress}
    />
  );
}