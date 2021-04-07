import React, { useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';
import NavLink from '../components/NavLink';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Spacer, Button, ThemedPage, TextInput } from '../components/ui';

const SignupScreen = () => {
    const { state, signup } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    return (
        <ThemedPage noHeader>
            <KeyboardAwareScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.inner}>

                    <Spacer>
                        <Text h3>Inscription</Text>
                    </Spacer>

                    <TextInput
                        placeholder="Nom"
                        value={name}
                        onChangeText={setName}
                        autoCorrect={false}
                    />
                    <Spacer />

                    <TextInput
                        placeholder="Prénom"
                        value={firstName}
                        onChangeText={setFirstName}
                        autoCorrect={false}
                    />
                    <Spacer />

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

                    <TextInput
                        placeholder="Confirmation mot de passe"
                        value={passwordConfirmation}
                        onChangeText={setPasswordConfirmation}
                        secure={true}
                        autoCorrect={false}
                    />

                    {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}

                    <Spacer>
                        <Button center title="S'inscrire" onPress={() => signup({ name, firstName, email, password, passwordConfirmation })} />
                    </Spacer>

                    <NavLink
                        routeName="Signin"
                        text="Déjà membre ? Connectez vous ici"
                    />
                </View>
            </KeyboardAwareScrollView>
        </ThemedPage>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // paddingVertical: 40,
        // height: 200
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
    },
});

export default SignupScreen;