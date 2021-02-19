import React, {useState, useContext} from 'react';
import {StyleSheet,View} from 'react-native' ;
import {Text, Input, Button} from 'react-native-elements';
import Spacer from '../components/Spacer';
import {Context as AuthContext} from '../context/AuthContext';
import NavLink from '../components/NavLink';
import {NavigationEvents} from 'react-navigation';

const SignupScreen = ({navigation}) => {
    const {state, signup, clearErrorMessage} = useContext(AuthContext);
    const [name, setName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    return (
        <View style={styles.container}>
            <NavigationEvents 
                onWillBlur={clearErrorMessage}
            />

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
                <Button title="S'inscrire" onPress={() => signup ({name, firstName, email, password, passwordConfirmation})} />
            </Spacer>

            <NavLink
                routeName="Signin"
                text="Déjà membre ? Connectez vous ici" 
            />
        </View>
    );
};

SignupScreen.navigationOptions = () => {
    return {
        headerShown: false
    };
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',

    },
    errorMessage:{
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        marginLeft: 20,
        marginTop: 10
    },
});

export default SignupScreen;