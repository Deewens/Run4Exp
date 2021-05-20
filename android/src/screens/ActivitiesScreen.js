import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Activity from '../components/challenge/ActivityUser';
import ChallengeApi from '../api/challenge.api';
import ThemedPage from '../components/ui/ThemedPage';
import { BaseModal, Button } from "../components/ui";
import UserSessionApi from '../api/user-session.api';

const UserChallengesScreen = ({ navigation,route }) => {
    let [challengeList, setChallengeList] = useState([]);

    const [userSession, setUserSession] = useState(null);
    const [refreshing, setRefreshing] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);

const highLightId = route?.params?.highLightId;

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        readData(2000).then(() => setRefreshing(false));
    }, []);

    const readData = async () => {
        var response = await ChallengeApi.pagedList(0);
        let challenges = response.data._embedded.challengeResponseModelList;

        challenges.filter((challenge) => {
            if (checkSession(challenge.id) !== null) {
                // console.log("les challenges sélectionnés " + challenge.id)
                return challenge;
            }
        });

        setChallengeList(challenges);
    };

    let navChallenge = (challengeId) => {
        navigation.navigate('Challenge', {
            id: challengeId,
        });
    }

    let checkSession = async (id) => {
        try {
            let responseSession = await UserSessionApi.self(id);
            if (responseSession.status === 200 && responseSession.data.length > 0) {
                return (responseSession.data);
            }
        } catch (err) {
            console.log(err);
        }
    }


    useEffect(() => {
        readData();
    }, []);

    return (
        <ThemedPage title="Mes courses" onUserPress={() => navigation.openDrawer()}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {challengeList.length == 0 ? <Text style={styles.text}>Vous n'avez pas commencé de challenge</Text> :
                    challengeList.map(function (challenge, key) {
                        return <Activity key={key} challenge={challenge} onPress={() => navChallenge(challenge.id)} isHighLight={challenge.id === highLightId}/>
                    })}
            </ScrollView>
        </ThemedPage>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 60,
        flex: 1,
    },
    title: {
        fontSize: 40,
        marginBottom: 10,
    },
    text: {
        fontSize: 20,
    }
});

export default UserChallengesScreen;
