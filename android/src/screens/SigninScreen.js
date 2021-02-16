import React, {useState, useContext} from 'react';
import {StyleSheet,View, TouchableOpacity} from 'react-native' 
import {Text, Input, Button} from 'react-native-elements';
import Spacer from '../components/Spacer';
import {Context} from '../context/AuthContext';
import NavLink from '../components/NavLink';
import {NavigationEvents} from 'react-navigation';

const SigninScreen = ({navigation}) => {
    const {state, signin, clearErrorMessage} = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
        <View style={styles.container}>
            <NavigationEvents 
                onWillBlur={clearErrorMessage}
            />

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
                <Button title="Se connecter" onPress={() => signin ({email, password})} />
            </Spacer>

            <NavLink
                routeName="Signup"
                text="Pas encore membre ? Inscrivez-vous ici" 
            />
        </View>
    );
};

SigninScreen.navigationOptions = () => {
    return {
        headerShown: false
    };
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        marginBottom: 250

    },
    errorMessage:{
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        marginLeft: 20,
        marginTop: 10
    }
});

export default SigninScreen;