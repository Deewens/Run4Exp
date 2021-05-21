import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableHighlight } from 'react-native';
import ChallengeApi from '../../api/challenge.api';
import { Image, Button } from '../ui';
import { DarkerTheme, LightTheme } from '../../styles/theme'
import { Theme } from '@react-navigation/native';
import { useTheme } from '../../styles';

export default (props: any) => {
    let { event } = props;

    const theme = useTheme();

    let selectedTheme = theme.mode === "dark" ? DarkerTheme : LightTheme;
    let styles = createStyles(selectedTheme, props.isHighLight)


    return (
        <View>
            <TouchableHighlight underlayColor={"COLOR"} style={styles.container}>
                <>
                    <View style={styles.description}>
                        {/* <Text style={styles.title}>{challenge.name}</Text> */}
                        <Text style={styles.text} >Vous avez parcouru {event.advancement} mètres</Text>
                    </View>
                </>
            </TouchableHighlight>
        </View>
    );
};

let createStyles = (selectedTheme: Theme, isHighLight?: boolean): any => {
    return StyleSheet.create({
        container: {
            flexDirection: "row",
            backgroundColor: isHighLight === true ? "#D1F3CC" : selectedTheme.colors.card,
            marginBottom: 20,
            shadowColor: "black",
            shadowOffset: {
                width: 0,
                height: 5,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,
            elevation: 10,
            padding: 15,
        },
        background: {
            flex: 1,
            height: "100%",
        },
        description: {
            flex: 2,
        },
        button: {
            margin: 5,
        },
        title: {
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 'bold',
            color: selectedTheme.colors.text
        },
        text: {
            padding: 5,
            paddingTop: 0,
            opacity: 0.85,
            color: selectedTheme.colors.text
        }
    });
}