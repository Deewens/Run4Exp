import React, { useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-elements';
import { Context } from '../context/AuthContext';
import NavLink from '../components/NavLink';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Spacer, Button, TextInput } from '../components/ui';
import ThemedPage from '../components/ui/ThemedPage'

const SigninScreen = ({ navigation, route }) => {
    const { state, signin } = useContext(Context);

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [password, setPassword] = useState('');

    let trySignin = async () => {
        await setIsLoading(true);

        try {
            await signin({ email, password });
        } catch (error) {
            await setIsLoading(false);
        }
    }

    return (
        <ThemedPage noHeader style={styles.container}>
            <KeyboardAwareScrollView>
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
                    {route?.params?.autoDisconnect ? <Text style={styles.errorMessage}>Vous avez été déconnecté</Text> : null}

                    <Spacer>
                        <Button center title="Se connecter" onPress={() => trySignin()} loader={isLoading}/>
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
        height: "100%",
    },
    inner: {
        padding: 15,
        flex: 1,
        justifyContent: "space-around",
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