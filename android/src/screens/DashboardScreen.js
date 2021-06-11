import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import ChallengeItem from '../components/challenge/ChallengeItem';
import ChallengeApi from '../api/challenge.api';
import ThemedPage from '../components/ui/ThemedPage';
import ChallengeDatabase from "../database/challenge.database";
import * as Network from 'expo-network';
import { LinearGradient } from 'expo-linear-gradient';


const DashboardScreen = ({ navigation }) => {
    // const [firstName, setFirstName] = useState('');

    // let [user, setUser] = useState({
    //     firstName: "",
    //     name: "",
    //     email: "",
    // });

    // let [challengeList, setChallengeList] = useState([]);
    // let [network, setNetwork] = useState({
    //     isConnected: true,
    //     isInternetReachable: true,
    // });

    // let [isLoading, setIsLoading] = useState(true);
    // const [refreshing, setRefreshing] = React.useState(false);
    // const challengeDatabase = ChallengeDatabase();

    // const onRefresh = React.useCallback(() => {
    //     setRefreshing(true);
    //     readData().then(() => setRefreshing(false));
    // }, []);

    // const readDataUser = async () => {
    //     try {
    //         var userStore = await AsyncStorage.getItem("user");
    //         if (userStore !== undefined) {
    //             var userObj = JSON.parse(userStore);
    //             setName(userObj.name);

    //             setUser(() => ({
    //                 firstName: userObj.firstName,
    //             }));
    //         }
    //     } catch (e) {
    //         alert("Failed to fetch the data from storage");
    //     }
    // };

    // const readData = async () => {
    //     await challengeDatabase.initTable();

    //     var defaultList = await challengeDatabase.listAll();

    //     if (defaultList !== undefined) {
    //         setChallengeList(defaultList);
    //     }

    //     let currentNetwork = await Network.getNetworkStateAsync()

    //     setNetwork(currentNetwork);

    //     try {
    //         var response = await ChallengeApi.pagedList(0);

    //         response.data._embedded.challengeResponseModelList.forEach(async (element) => {
    //             await challengeDatabase.replaceEntity({
    //                 id: element.id,
    //                 name: element.name,
    //                 description: element.description,
    //                 shortDescription: element.shortDescription,
    //                 scale: element.scale,
    //             });
    //         });

    //         setChallengeList(response.data._embedded.challengeResponseModelList);
    //     } catch {
    //         console.log("no server")
    //         setNetwork({
    //             isConnected: false,
    //             isInternetReachable: false
    //         })
    //     }

    //     setIsLoading(false);
    // };

    // let navChallenge = (challengeId) => {
    //     navigation.navigate('Challenge', {
    //         id: challengeId,
    //     });
    // }

    // useEffect(() => {
    //     readDataUser();
    //     readData();
    // }, []);

    return (

        // noNetwork={!network?.isConnected}
        // loader={isLoading}
        <>
            {/* <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            > */}
            <View style={styles.container}>
                <LinearGradient colors={['#29283D', '#3b5998', '#413E52']}>
                    <View style={styles.header}>
                        <View style={[styles.block, styles.presentation]}>
                            <Text style={styles.title}>Dashboard</Text>
                        </View>
                        <View style={[styles.block, styles.stat, styles.started]}><Text>6 challenges lancés</Text></View>
                        <View style={[styles.block, styles.stat, styles.accomplish]}><Text>5 challenges accomplies</Text></View>
                        <View style={[styles.block, styles.stat, styles.kilometer]}><Text>60km parcourus</Text></View>
                        <View style={[styles.block, styles.stat, styles.time]}><Text>7h de courses</Text></View>

                    </View>
                </LinearGradient>

                {/* <View style={styles.block} onPress={() => props.navigation.navigate('Home')}><Text>Commencer nouveau challenge</Text></View> */}



                {/* {challengeList.length == 0 ? <Text style={styles.text}>Aucun challenge à présenter</Text> :
          challengeList.map(function (challenge, key) {
            return <ChallengeItem key={key} challenge={challenge} onPress={() => navChallenge(challenge.id)} />;
          })} 
            </ScrollView>*/}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginLeft: 0,
        flex: 1,
    },
    header: {
        borderRadius: 10,
        display: 'flex',
        alignItems: 'baseline',
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
        height: 700,
    },
    block: {
        display: 'flex',
        height: 60,
        flexDirection: 'column',
        marginTop: 20,
        marginLeft: 40,
        alignItems: 'baseline',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    presentation: {
        borderRadius: 5,
        display: 'flex',
        backgroundColor: "red",
        width: 400,
        height: 200,
        backgroundColor: 'rgba(40, 40, 60, 0.7)',
        elevation: 0,
    },
    stat: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        marginBottom: 5,
        height: 50,
        width: 200,
    },
    kilometer: {
        backgroundColor: 'rgba(251, 51, 0, 0.6)',
    },
    accomplish: {
        backgroundColor: 'rgba(44, 242, 140, 0.6)',
    },
    started: {
        backgroundColor: 'rgba(235, 40, 39, 0.6)',
    },
    time: {
        backgroundColor: 'rgba(44, 242, 255, 0.6)',
    },
    title: {
        fontSize: 24,
        color: "white",
    },
    text: {
        fontSize: 20,
    }
});

export default DashboardScreen;