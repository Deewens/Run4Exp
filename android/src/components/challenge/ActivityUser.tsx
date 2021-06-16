import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableHighlight } from 'react-native';
import ChallengeApi from '../../api/challenge.api';
import { Image, Button, Spacer } from '../ui';
import { DarkerTheme, LightTheme } from '../../styles/theme'
import { Theme } from '@react-navigation/native';
import { useTheme } from '../../styles';
import ActivityModal from '../modal/ActivityModal';
import UserSessionApi from '../../api/user-session.api';
import ChallengeDatabase from '../../database/challenge.database';
import ChallengeImageDatabase from '../../database/challengeImage.database';
import EventToSendDatabase from '../../database/eventToSend.database';
import ObstacleDatabase from '../../database/obstacle.database';
import SegmentDatabase from '../../database/segment.database';
import ChallengeDataUtils from '../../utils/challengeData.utils';
import { eventType } from '../../utils/challengeStore.utils';

export default (props: any) => {
    let { session, onPress, navigation } = props;
    let [base64, setBase64] = useState(null);
    let [challenge, setChallenge] = useState(null);
    let [modalTransport, setModalTransport] = useState(null);
    let [canStart, setCanStart] = useState(null);
    let [isEnd, setIsEnd] = useState(null);

    const theme = useTheme();

    let selectedTheme = theme.mode === "dark" ? DarkerTheme : LightTheme;
    let styles = createStyles(selectedTheme, props.isHighLight);

    let challengeDatabase = ChallengeDatabase()
    let challengeImageDatabase = ChallengeImageDatabase()
    let eventToSendDatabase = EventToSendDatabase()
    let obstacleDatabase = ObstacleDatabase()
    let segmentDatabase = SegmentDatabase()

    let challengeDataUtils = ChallengeDataUtils();

    const readData = async () => {

        let challengeData = await challengeDataUtils.syncData(navigation, session.id);

        setChallenge(challengeData);

        if (challengeData.userSession.events) {
            setCanStart(challengeData.userSession.events.length == 0);

            let end = false;
            challengeData.userSession.events.forEach(event => {
                if (event.type == eventType[eventType.END]) {
                    end = true;
                }
            });

            setIsEnd(end);
        } else {
            setCanStart(challengeData.userSession.events.length == 0)

            setIsEnd(challengeData.userSession.isEnd)
        }


        let background = null;
        try {

            background = (await challengeImageDatabase.selectById(challengeData.id))?.value;

            if (!background) {
                let { data: responseBase64 } = await ChallengeApi.getBackgroundBase64(
                    challengeData.id
                );
                background = responseBase64.background;
                await challengeImageDatabase.replaceEntity({ //TODO: replace by only insert
                    id: challengeData.id,
                    value: background,
                    isThumbnail: false
                });
            }

        } catch (error) {
            let entity = await challengeImageDatabase.selectById(challengeData.id);
            background = entity.value;
        }
        setBase64(background);
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
    }, [session]);

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
                                <View style={styles.sameLine}>
                                    {
                                        canStart ? null :
                                            <Button style={styles.button} icon="book" color='light' width={50} onPress={() => navigation.navigate("History", { sessionId: session.id })} />
                                    }

                                    {
                                        !(canStart || isEnd) ?
                                            <Button style={styles.buttonAction} title="Reprendre la course" width={190} onPress={() => setModalTransport(true)} />
                                            : null
                                    }

                                    {
                                        canStart ?
                                            <Button style={styles.button} title="Démarer la course" width={190} onPress={() => setModalTransport(true)} />
                                            : null
                                    }

                                    {
                                        isEnd ?
                                            <Text style={styles.buttonAction}>Challenge terminé</Text>
                                            : null
                                    }
                                </View>
                                <Text style={styles.date}>{new Date(session.inscriptionDate).toLocaleString()}</Text>
                            </View>}
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
            flex: 3,
        },
        button: {
            flex: 1,
            margin: 5,
        },
        buttonAction: {
            flex: 5,
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
        },
        sameLine: {
            width: "100%",
            flexDirection: "row",
            justifyContent: 'flex-end',
            display: 'flex',
            alignItems: 'center'
        },
        date: {
            textAlign: 'center',
            fontSize: 15,
            color: selectedTheme.colors.text
        },
    });
}