import React, { useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';
import NavLink from '../components/NavLink';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Spacer, Button, TextInput } from '../components/ui';
import ThemedPage from '../components/ui/ThemedPage';

const SignupScreen = ({navigation}) => {
    const { state, signup } = useContext(AuthContext);

    // form
    const [name, setName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    // show errors
    const [passwordConfirmationError, setPasswordConfirmationError] = useState('');

    // button
    const [disableButton, setDisableButton] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = () =>{
        if(firstName && name && email && password && passwordConfirmation) setDisableButton(false);
        else setDisableButton(true);
    };

    let trySignup = async () => {
        setIsLoading(true);
        setPasswordConfirmationError('');

        if(password !== passwordConfirmation){
            setPasswordConfirmationError("Les mots de passe ne sont pas identiques")
        }
        else if(!validateEmail(email)){
            setErrorConnection("L'adresse mail n'est pas valide")
        }
        else{
            try {
                await signup({ name, firstName, email, password, passwordConfirmation });
                navigation.navigate('Signin')
            } catch (error) {
                console.log(error)
            }finally {
                setIsLoading(false);
            }
        }
    }

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

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
                        onChange={handleChange}
                    />
                    <Spacer />

                    <TextInput
                        placeholder="Prénom"
                        value={firstName}
                        onChangeText={setFirstName}
                        autoCorrect={false}
                        onChange={handleChange}
                    />
                    <Spacer />

                    <TextInput
                        placeholder="E-mail"
                        value={email}
                        onChangeText={setEmail}
                        autoCorrect={false}
                        keyboardType="email-address"
                        onChange={handleChange}
                    />
                    <Spacer />

                    <TextInput
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secure={true}
                        autoCorrect={false}
                        onChange={handleChange}
                    />
                    <Spacer />

                    <TextInput
                        placeholder="Confirmation mot de passe"
                        value={passwordConfirmation}
                        onChangeText={setPasswordConfirmation}
                        secure={true}
                        autoCorrect={false}
                        onChange={handleChange}
                        errorMessage={passwordConfirmationError}
                    />

                    {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}

                    <Spacer>
                        <Button center title="S'inscrire" onPress={() => trySignup()} loader={isLoading} disable={disableButton}/>
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