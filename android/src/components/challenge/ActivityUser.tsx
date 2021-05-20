import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableHighlight } from 'react-native';
import ChallengeApi from '../../api/challenge.api';
import { Image, Button } from '../ui';
import { DarkerTheme, LightTheme } from '../../styles/theme'
import { Theme } from '@react-navigation/native';
import { useTheme } from '../../styles';
import ActivityModal from '../modal/ActivityModal';

export default (props: any) => {
    let { challenge, onPress, navigation } = props;
    let [base64, setBase64] = useState(null);
    const [modalTransport, setModalTransport] = useState(null);

    const theme = useTheme();

    let selectedTheme = theme.mode === "dark" ? DarkerTheme : LightTheme;
    let styles = createStyles(selectedTheme, props.isHighLight);

    console.log(props.isHighLight)

    const readData = async () => {
        let response = await ChallengeApi.getBackgroundBase64(challenge.id);

        setBase64(response.data.background);
    };

    let gotoChallengeMap = (choosenTransport) => {
        setModalTransport(null)

        navigation.navigate('ChallengeMap', {
            id: challenge.id,
            choosenTransport
        });
    }

    let handleMeansTransportChange = async (choosenTransport) => {
        if (choosenTransport === 'none') {
            setModalTransport(null)
            return;
        }

        gotoChallengeMap(choosenTransport);
    }

    useEffect(() => {
        readData();
    }, []);

    return (
        <View>

            <ActivityModal
                open={modalTransport != null}
                onSelect={(s) => handleMeansTransportChange(s)}
                onExit={() => handleMeansTransportChange('none')} />

            <TouchableHighlight underlayColor={"COLOR"} onPress={() => onPress()} style={styles.container}>
                <>
                    <Image
                        style={styles.background}
                        height={120}
                        width="100%"
                        base64={base64}
                        isLoading={base64 === null}
                    />
                    <View style={styles.description}>
                        <Text style={styles.title}>{challenge.name}</Text>
                        <Text style={styles.text} numberOfLines={2}>{challenge.shortDescription}</Text>
                        <Button style={styles.button} title="Reprendre la course" color="green" width={200} onPress={() => setModalTransport(true)} />
                        <Button style={styles.button} title="Historique" color="blue" width={100} />
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