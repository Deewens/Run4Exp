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
                                <Text style={[styles.text, styles.valueStat]}>6</Text>
                            </View>
                            <Text style={[styles.text]}> challenges lancés</Text>
                        </View>

                        <View style={[styles.block, styles.stat]}>
                            <View style={styles.bubleStat}>
                                <Text style={[styles.text, styles.valueStat]}>5</Text>
                            </View>
                            <Text style={[styles.text]}> challenges accomplis</Text>
                        </View>

                        <View style={[styles.block, styles.stat]}>
                            <View style={styles.bubleStat}>
                                <Text style={[styles.text, styles.valueStat]}>60km</Text>
                            </View>
                            <Text style={[styles.text]}> parcourus</Text>
                        </View>

                        <View style={[styles.block, styles.stat]}>
                            <View style={styles.bubleStat}>
                                <Text style={[styles.text, styles.valueStat]}>7h</Text>
                            </View>
                            <Text style={[styles.text]}> de course</Text>
                        </View>
                    </View>

            {/*</ScrollView>*/}
            </View>
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
    },
    text: {
        color: 'white',
        fontSize: 20,
        marginLeft: 10,
    },
    bubleStat:{
        height: '100%',
        width: '23%',
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