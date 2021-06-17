import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableHighlight } from 'react-native';
import { DarkerTheme, LightTheme } from '../../styles/theme'
import { Theme } from '@react-navigation/native';
import { useTheme } from '../../styles';

export default (props: any) => {
    let { event } = props;
    
    const [text, setText] = useState('');
    const theme = useTheme();

    let selectedTheme = theme.mode === "dark" ? DarkerTheme : LightTheme;
    let styles = createStyles(selectedTheme, props.isHighLight);

    // Compatible android
    const formateDate = (date) => {
        require('intl'); // import intl object
        require('intl/locale-data/jsonp/fr-FR'); // load the required locale details
        require('date-time-format-timezone');
        return date.toLocaleString("fr-FR", { timeZone: 'Europe/Paris' })
    }

    const convertEventType = () => {
        switch(event.type){
            case 'BEGIN_RUN':
                setText(`Début de la session de ${chooseTypeofCourse(event.value)}`);
                break;
            case 'ADVANCE':
                setText(`Vous avez avancé de ${Math.round(event.value)} m`);
                break;
            case 'CHANGE_SEGMENT':
                setText("Changement de segment");
                break;
            case 'CHOOSE_PATH':
                setText("Vous avez choisi une intersection");
                break;
            case 'END_RUN':
                setText(`Fin de la session ${chooseTypeofCourse(event.value)}`);
                break;
            case 'PASS_OBSTACLE':
                setText("Vous avez passé un obstacle");
                break;
            case 'END':
                setText("Challenge terminé, félicitation !");
            break;
            default:
                setText(event.value)
                break;
        }
    };

    const chooseTypeofCourse = (courseType) =>{
        if(courseType === "pedometer" || courseType === "gps-foot") return "marche";
        else if(courseType === "gps-bike") return "vélo";
        else return "en debug";
    };
    
    useEffect(() => {
        convertEventType();
    }, []);

    return (
        <View>
            <TouchableHighlight underlayColor={"COLOR"} style={styles.container}>
                <>
                    <View style={styles.description}>
                        <Text style={styles.text}> 
                            {formateDate(new Date(event.date))}
                        </Text>
                        <Text>
                            {text}
                        </Text>
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