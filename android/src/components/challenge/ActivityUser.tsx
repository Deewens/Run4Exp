import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableHighlight } from 'react-native';
import ChallengeApi from '../../api/challenge.api';
import { Image, Button, Spacer } from '../ui';
import { DarkerTheme, LightTheme } from '../../styles/theme'
import { Theme } from '@react-navigation/native';
import { useTheme } from '../../styles';
import ActivityModal from '../modal/ActivityModal';
import UserSessionApi from '../../api/user-session.api';

export default (props: any) => {
    let { session, challengeList, onPress, navigation } = props;
    let [base64, setBase64] = useState(null);
    let [challenge, setChallenge] = useState(null);
    let [modalTransport, setModalTransport] = useState(null);
    let [canStart, setCanStart] = useState(null);
    let [isEnd, setIsEnd] = useState(null);

    const theme = useTheme();

    let selectedTheme = theme.mode === "dark" ? DarkerTheme : LightTheme;
    let styles = createStyles(selectedTheme, props.isHighLight);

    const readData = async () => {
        let selectedChallenge = challengeList.find(x => x.id == session.challengeId);

        setChallenge(selectedChallenge);

        let responseSessionRuns = await UserSessionApi.runs(session.id);

        setCanStart(responseSessionRuns.data.length == 0);

        let responseSession = await UserSessionApi.getById(session.id);

        setIsEnd(responseSession.data.isEnd)

        let response = await ChallengeApi.getBackgroundBase64(selectedChallenge.id);

        setBase64(response.data.background);
    };

    let gotoChallengeMap = (choosenTransport) => {
        setModalTransport(null)

        navigation.navigate('ChallengeMap', {
            challengeId: challenge.id,
            sessionId: session.id,
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
            {
                challenge == null ? null : (
                    <TouchableHighlight underlayColor={"COLOR"} onPress={() => onPress()} style={styles.container}>
                        <>
                            <Image
                                style={styles.background}
                                height={120}
                                width="100%"
                                base64={base64}
                                isLoading={base64 === null}
                            />
                            {
                                canStart == null || isEnd == null ?
                                    <View style={styles.description}>
                                        <Spacer>
                                            <View></View>
                                        </Spacer>
                                    </View>
                                    :
                                    <View style={styles.description}>
                                        <Text style={styles.title}>{challenge.name}</Text>
                                        <Text style={styles.text} numberOfLines={2}>{challenge.shortDescription}</Text>
                                        {
                                            canStart ? null :
                                                <Button style={styles.button} icon="book" color="blue" width={50} onPress={() => navigation.navigate("History", { sessionId: session.id })} />
                                        }

                                        {
                                            !(canStart || isEnd) ?
                                                <Button style={styles.button} title="Reprendre la course" color="green" width={200} onPress={() => setModalTransport(true)} />
                                                : null
                                        }

                                        {
                                            canStart ?
                                                <Button style={styles.button} title="Démarer la course" color="green" width={200} onPress={() => setModalTransport(true)} />
                                                : null
                                        }

                                        {
                                            isEnd ?
                                                <Text style={styles.button}>Challenge terminé</Text>
                                                : null
                                        }
                                    </View>}
                        </>
                    </TouchableHighlight>
                )
            }
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