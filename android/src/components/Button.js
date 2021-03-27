import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

const Button = ({text, routeName, onPress, color}) =>{
    return(
        <>
            <TouchableOpacity style={styles.container} onPress={() => onPress}>
                <Text style={styles.text}>{text}</Text>
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    text:{
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },
    container: {
      backgroundColor:'blue'
    }
});

export default Button;