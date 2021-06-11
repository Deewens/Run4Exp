import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Activity from '../components/challenge/ActivityUser';
import ChallengeApi from '../api/challenge.api';
import ThemedPage from '../components/ui/ThemedPage';
import { BaseModal, Button } from "../components/ui";
import UserSessionApi from '../api/user-session.api';

const UserChallengesScreen = ({ navigation, route }) => {
    let [sessionChallenge, setSessionChallenge] = useState([]);
    let [loading, setLoading] = useState(null);

    const [refreshing, setRefreshing] = React.useState(false);

    const highLightId = route?.params?.highLightId;

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        readData().then(() => setRefreshing(false));
    }, []);

    const readData = async () => {
        let responseSession = await UserSessionApi.selfByUser();

        setSessionChallenge(responseSession.data);
    };

    useEffect(() => {
        setLoading(true);
        readData();
        setLoading(false);
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            readData();
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <ThemedPage title="Mes courses" loader={loading === null || loading === true} onUserPress={() => navigation.openDrawer()}>
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
                        return <Activity key={key} session={session} onPress={() => null} navigation={navigation} isHighLight={session.id === highLightId} />
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
