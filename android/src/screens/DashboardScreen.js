import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Text, StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import ThemedPage from '../components/ui/ThemedPage';
import { Avatar } from '../components/ui';
import { Context as AuthContext } from '../context/AuthContext';
import ApiUsers from '../api/users.api';

const DashboardScreen = ({ navigation }) => {
    const { state } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [stat, setStat] = useState({finishedChallenges: 0, ongoingChallenges: 0, totalDistance: 0, totalTime: 0 });
    const{finishedChallenges, ongoingChallenges, totalDistance, totalTime } = stat;

    const readData = async () => {
        try {
            let responseStat = await ApiUsers.getStatistics();
           setStat(responseStat.data);
        }catch {
        }
        setLoading(false);
    };
    
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        readData().then(() => setRefreshing(false));

    }, []);

    useEffect(() => {
        readData();
    }, []);

    return (
        <>
             <ThemedPage 
                title="Dashboard" 
                onUserPress={() => navigation.openDrawer()} 

            >

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
            <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={[styles.block, styles.presentation]}>
                            <View style={styles.buble}>
                                <Avatar size={100}/>
                                <Text style={styles.title}>{state.user?.firstName} {state.user?.name}</Text>
                            </View>
                        </View>

                        <View style={[styles.block, styles.stat]}>
                            <View style={styles.bubleStat}>
                                <Text style={[styles.text, styles.valueStat]}>{ongoingChallenges}</Text>
                            </View>
                            <Text style={[styles.text]}> 
                                {ongoingChallenges >=2 ? "challenges en cours" : "challenge en cours"}
                            </Text>
                        </View>

                        <View style={[styles.block, styles.stat]}>
                            <View style={styles.bubleStat}>
                                <Text style={[styles.text, styles.valueStat]}>{finishedChallenges}</Text>
                            </View>
                            <Text style={[styles.text]}>
                                {finishedChallenges  >= 2 ? "challenges accomplis" : "challenge accompli"}
                            </Text>
                        </View>

                        <View style={[styles.block, styles.stat]}>
                            <View style={styles.bubleStat}>
                                <Text style={[styles.text, styles.valueStat]}>{totalDistance / 1000} km</Text>
                            </View>
                            <Text style={[styles.text]}>{totalDistance / 1000 >= 2 ? "parcourus" : "parcouru"} </Text>
                        </View>

                        <View style={[styles.block, styles.stat]}>
                            <View style={styles.bubleStat}>
                                <Text style={[styles.text, styles.valueStat]}>{(new Date(totalTime * 1000).toISOString().substr(11, 8))}
                                </Text>
                            </View>
                            <Text style={[styles.text]}> de course</Text>
                        </View>
                    </View>
            </View>
            </ScrollView>
            </ThemedPage>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
    },
    header: {
        borderRadius: 10,
        display: 'flex',
        height: '30%',
    },
    block: {
        display: 'flex',
        flexDirection: 'row',
        height: '20%',
        marginTop: 15,
        alignItems: 'center',
    },
    presentation: {
        display: 'flex',
        backgroundColor: '#00373E',
        borderRadius: 5,
        borderTopRightRadius: 43,
        height: 150,
        marginTop: 5,
    },
    buble:{
        alignItems: 'center',
        flexDirection: "row",
        backgroundColor: 'rgba(255,255,255,0.3)',  
        borderRadius: 40,
        padding: 5,
        width: '95%',
    },
    stat: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        marginBottom: 5,
        height: 70,
        marginLeft: 10,
        backgroundColor: 'rgba(0, 55, 62, 0.8)',
    },
    title: {
        fontSize: 18,
        color: 'white',
        marginLeft: 5,
    },
    text: {
        color: 'white',
        fontSize: 20,
        marginLeft: 10,
    },
    bubleStat:{
        height: '100%',
        width: '28%',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 0.5,
    },
    valueStat:{
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
    },
});

export default DashboardScreen;