import React, { useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import Spacer from '../components/Spacer';
import { Context as AuthContext } from '../context/AuthContext';
import NavLink from '../components/NavLink';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SignupScreen = () => {
    const { state, signup } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.scrollview}>
            <View style={styles.inner}>

                <Spacer>
                    <Text h3>Inscription</Text>
                </Spacer>

                <Input
                    label="Nom" value={name}
                    onChangeText={setName}
                    autoCorrect={false}
                />
                <Spacer />

                <Input
                    label="Prénom" value={firstName}
                    onChangeText={setFirstName}
                    autoCorrect={false}
                />
                <Spacer />

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

                <Input
                    label="Confirmation mot de passe"
                    value={passwordConfirmation}
                    onChangeText={setPasswordConfirmation}
                    secureTextEntry={true}
                    autoCorrect={false}
                />

                {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}

                <Spacer>
                    <Button title="S'inscrire" onPress={() => signup({ name, firstName, email, password, passwordConfirmation })} />
                </Spacer>

                <NavLink
                    routeName="Signin"
                    text="Déjà membre ? Connectez vous ici"
                />
            </View>
        </KeyboardAwareScrollView>
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
        marginTop:15,
        padding: 24,
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