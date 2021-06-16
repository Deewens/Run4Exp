import React, { useContext, useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Activity from '../components/challenge/ActivityUser';
import ChallengeApi from '../api/challenge.api';
import ThemedPage from '../components/ui/ThemedPage';
import { BaseModal, Button } from "../components/ui";
import UserSessionApi from '../api/user-session.api';
import UserSessionDatabase from '../database/userSession.database';
import { Context as AuthContext } from '../context/AuthContext';

const UserChallengesScreen = ({ navigation, route }) => {
    let [sessionChallenge, setSessionChallenge] = useState([]);
    let [buttonLoading, setButtonLoading] = useState(true);
    let [loading, setLoading] = useState(true);
    const context = useContext(AuthContext);
    let [networkState, setNetworkState] = useState(true);

    const [refreshing, setRefreshing] = React.useState(false);

    const highLightId = route?.params?.highLightId;

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        readData().then(() => setRefreshing(false));
    }, []);

    const userSessionDatabase = UserSessionDatabase()

    const readData = async () => {
        setButtonLoading(true);

        try {
            let responseSession = await UserSessionApi.selfByUser();
            await setSessionChallenge(responseSession.data);
            await setNetworkState(true)
        } catch {

            let list = await userSessionDatabase.listByUserId(context.state.user.id);

            await setSessionChallenge(list);

            await setNetworkState(false)
        } finally {
            setButtonLoading(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        readData();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            readData();
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <ThemedPage title="Mes courses" loader={loading === true} onUserPress={() => navigation.openDrawer()} noNetwork={!networkState}>
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
                        return <Activity key={key} session={session} onPress={() => null} navigation={navigation} isHighLight={session.id === highLightId} loading={buttonLoading} />
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
