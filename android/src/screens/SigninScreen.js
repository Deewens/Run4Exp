import React, { useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-elements';
import { Context } from '../context/AuthContext';
import NavLink from '../components/NavLink';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Spacer, Button, ThemedPage, TextInput } from '../components/ui';

const SigninScreen = () => {
    const { state, signin } = useContext(Context);

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    return (
        <ThemedPage showUser={false}>
            <KeyboardAwareScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.inner}>

                    <Spacer>
                        <Text h3>Connexion</Text>
                    </Spacer>
                    <TextInput
                        placeholder="E-mail"
                        value={email}
                        onChangeText={setEmail}
                        autoCorrect={false}
                        keyboardType="email-address"
                    />
                    <Spacer />

                    <TextInput
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secure={true}
                        autoCorrect={false}
                    />
                    <Spacer />

                    {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}

                    <Spacer>
                        <Button center title="Se connecter" onPress={() => signin({ email, password })} />
                    </Spacer>

                    <NavLink
                        routeName="Signup"
                        text="Pas encore membre ? Inscrivez-vous ici"
                    />
                </View>
            </KeyboardAwareScrollView>
        </ThemedPage>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
    },
    inner: {
        padding: 15,
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