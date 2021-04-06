import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet, View, ScrollView, TouchableHighlight } from "react-native";
import Spacer from "../components/Spacer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChallengeApi from "../api/challenge.api";
import { Context as AuthContext } from '../context/AuthContext';
import { apiUrl } from '../utils/const'
import Svg, {
  Defs, LinearGradient, Stop, Path, Circle, Rect, Polyline,Image
} from "react-native-svg";

const Checkpoint = (props) => {

  return (
    // <Svg height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
    //   <Path d="M0 0h24v24H0z" fill="none" />
    //   <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    // </Svg>

    <Image 
    x={props.x} 
    y={props.y} 
    height="45" 
    width="45" 
    style={
      {
        transform: {
          translateY: "-45",
          translateX: "-22.5"
        },
      }
    }
    href={require("../../assets/checkpoint.png")}
/>
  );
};

export default Checkpoint;