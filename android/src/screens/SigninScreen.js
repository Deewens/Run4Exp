import React, { useState, useContext } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native'
import { Text, Input } from 'react-native-elements';
import Spacer from '../components/Spacer';
import { Context } from '../context/AuthContext';
import NavLink from '../components/NavLink';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Button from '../components/Button'

const SigninScreen = () => {
    const { state, signin } = useContext(Context);

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    return (
        <SafeAreaView>
            <KeyboardAwareScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.inner}>

                    <Spacer>
                        <Text h3>Connexion</Text>
                    </Spacer>
                    <Input
                        label="E-mail" value={email}
                        onChangeText={setEmail}
                        autoCorrect={false}
                    />
                    <Spacer />

                    <Input
                        label="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        autoCorrect={false}
                    />
                    <Spacer />

                    {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}

                    <Spacer>
                        <Button title="Se connecter" onPress={() => signin({ email, password })} />
                    </Spacer>

                    <NavLink
                        routeName="Signup"
                        text="Pas encore membre ? Inscrivez-vous ici"
                    />
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollview: {
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    container: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
    },
    inner: {
        padding: 18,
        flex: 1,
        justifyContent: "space-around"
    },
    errorMessage: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        marginLeft: 20,
        marginTop: 10
    }
});

export default SigninScreen;