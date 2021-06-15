import React, { useEffect, useState, useContext } from 'react';
import { Text, StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import ThemedPage from '../components/ui/ThemedPage';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from '../components/ui';
import { Context as AuthContext } from '../context/AuthContext';

const DashboardScreen = ({ navigation }) => {
    const { state } = useContext(AuthContext);

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
             <ThemedPage 
                title="Dashboard" 
                onUserPress={() => navigation.openDrawer()} 
                // noNetwork={!network?.isConnected}
                // loader={isLoading}
            >
            <LinearGradient style={styles.screen} colors={['#0000', '#FFF']} start={[0,2]} end={[1,0]}>
            <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={[styles.block, styles.presentation]}>
                            <View style={styles.buble}>
                            <Avatar size={100} />
                            <Text style={styles.title}>{state.user?.firstName} {state.user?.name}</Text>
                            </View>
                        </View>
                        <View style={[styles.block, styles.stat, styles.started]}><Text>6 challenges lancés</Text></View>
                        <View style={[styles.block, styles.stat, styles.accomplish]}><Text>5 challenges accomplies</Text></View>
                        <View style={[styles.block, styles.stat, styles.kilometer]}><Text>60km parcourus</Text></View>
                        <View style={[styles.block, styles.stat, styles.time]}><Text>7h de courses</Text></View>
                    </View>
                

                {/* <View style={styles.block} onPress={() => props.navigation.navigate('Home')}><Text>Commencer nouveau challenge</Text></View> */}



                {/* {challengeList.length == 0 ? <Text style={styles.text}>Aucun challenge à présenter</Text> :
          challengeList.map(function (challenge, key) {
            return <ChallengeItem key={key} challenge={challenge} onPress={() => navChallenge(challenge.id)} />;
          })} 
            </ScrollView>*/}
            </View>
            </LinearGradient>
            </ThemedPage>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 0,
        flex: 1,
        width: 350,
        height: 575,
    },
    header: {
        borderRadius: 10,
        display: 'flex',
        alignItems: 'baseline',
        elevation: 24,
        height: 500,
    },
    block: {
        display: 'flex',
        height: 60,
        flexDirection: 'column',
        marginTop: 20,
        alignItems: 'baseline',
        elevation: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    presentation: {
        display: 'flex',
        backgroundColor: 'rgba(0, 0, 0,0.8)',
        marginLeft: 26,
        borderRadius: 5,
        borderTopRightRadius: 43,
        width: 298,
        height: 150,
        elevation: 0,
        marginTop: 5,
    },
    buble:{
        alignItems: 'center',
        flexDirection: "row",
        backgroundColor: 'rgba(200,200,200,0.3)',  
        borderRadius: 40,
        padding: 5,
        borderBottomRightRadius: 70, 
        width: 250,
    },
    stat: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        marginBottom: 5,
        height: 50,
        width: 200,
        marginLeft: 70,
    },
    kilometer: {
        backgroundColor: 'rgba(100, 100, 255, 0.6)',
    },
    accomplish: {
        backgroundColor: 'rgba(44, 242, 140, 0.6)',
    },
    started: {
        backgroundColor: 'rgba(235, 40, 39, 0.6)',
    },
    time: {
        backgroundColor: 'rgba(44, 242,100, 0.6)',
    },
    title: {
        fontSize: 20,
        color: 'white',
    },
    text: {
        fontSize: 20,
    }
});

export default DashboardScreen;