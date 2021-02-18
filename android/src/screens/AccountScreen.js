import React, {useContext} from 'react';
import { Text, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';
import Spacer from '../components/Spacer';
import {Context as AuthContext} from '../context/AuthContext';
import {SafeAreaView} from 'react-navigation';

const AccountScreen = ({}) => {
    const {signout} = useContext(AuthContext);
    return (
        <View style={styles.container}>
            <Text style={{fontSize:48}}>Compte</Text>
            <Spacer>
                <Button title="Déconnexion" onPress={signout} />
            </Spacer>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        marginTop: 100,
        flex: 1
    },
});

export default AccountScreen;