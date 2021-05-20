import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Activity from '../components/challenge/ActivityUser';
import ChallengeApi from '../api/challenge.api';
import ThemedPage from '../components/ui/ThemedPage';
import { BaseModal, Button } from "../components/ui";
import UserSessionApi from '../api/user-session.api';

const UserChallengesScreen = ({ navigation, route }) => {
    let [challengeList, setChallengeList] = useState([]);
    let [sessionChallenge, setSessionChallenge] = useState([]);


    const [refreshing, setRefreshing] = React.useState(false);

    const highLightId = route?.params?.highLightId;

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        readData(2000).then(() => setRefreshing(false));
    }, []);

    const readData = async () => {
        let response = await ChallengeApi.pagedList(0);
        
        let challenges = response.data._embedded.challengeResponseModelList;
        
        setChallengeList(challenges);

        let responseSession = await UserSessionApi.selfByUser();

        setSessionChallenge(responseSession.data);
    };

    // let checkSession = async (id) => {
    //     setSessionChallenge(null);

    //     try {
    //         let responseSession = await UserSessionApi.self(id);

    //         if (responseSession.status == 200) {
    //             setSessionChallenge(responseSession.data);
    //         }
    //     }
    //     catch (error) {
    //         console.log(error);
    //     }
    // }


    useEffect(() => {
        readData();
    }, []);

    return (
        <ThemedPage title="Mes courses">
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {sessionChallenge.length == 0 ? <Text style={styles.text}>Vous n'avez pas commencé de challenge</Text> :
                    sessionChallenge.map(function (session, key) {
                        return <Activity key={key} session={session} challengeList={challengeList} onPress={() => navChallenge(session.challengeId)} navigation={navigation} isHighLight={session.id === highLightId} />
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
