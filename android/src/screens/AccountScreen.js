import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import Spacer from '../components/ui/Spacer';
import { Context } from '../context/AuthContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ThemedPage from '../components/ui/ThemedPage';
import TextInput from '../components/ui/TextInput';
import ButtonUi from '../components/ui/Button';

const AccountScreen = ({ navigation }) => {
  const { state, update } = useContext(Context);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');


  let [user, setUser] = useState({
    firstName: "",
    name: "",
    email: "",
  });

  const readData = async () => {
    try {
      var userStore = await AsyncStorage.getItem("user");
      if (userStore !== undefined) {
        let userObj = JSON.parse(userStore);
        userObj = JSON.parse(userObj); // besoin de parser 2x sinon bug
        
        setFirstName(userObj.firstName);
        setName(userObj.name);
        setEmail(userObj.email);

        setUser(() => ({
          firstName: userObj.firstName,
          name: userObj.name,
          email: userObj.email,
        }));
      }
      
    } catch (e) {
      alert("Failed to fetch the data from storage");
    }
  };

  let tryUpdate = async () => {
    setErrorMessage('');
    setIsLoading(true);

    const validateEmail = (email) => {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    };

    console.log(validateEmail(email))

    if(newPassword !== newPasswordConfirmation){
      setErrorMessage("Les nouveaux mots de passe ne sont pas identiques")
    }else if(!validateEmail(email)){
      setErrorMessage("L'adresse mail n'est pas valide")
    }
    else{
      try {
        await update({ firstName, name, email, password, newPassword, newPasswordConfirmation });
      } catch (error) {
          setErrorMessage("Une erreure s'est produite");
          console.log(error);
      }
    }
    setIsLoading(false)
}

  useEffect(() => {
    readData();
  }, []);

  return (
    <ThemedPage title="Vos informations" showUser={false} showReturn={true} onReturnPress={() => navigation.goBack()}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollview}>
        <View style={styles.inner}>
          <Text style={styles.label}>Prénom</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            autoCorrect={false}
          />

          <Text style={styles.label}>Nom</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            autoCorrect={false}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            placeholder={user.email}
            value={email}
            onChangeText={setEmail}
            autoCorrect={false}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Mot de passe actuel</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            autoCorrect={false}
          />

          <Text style={styles.label}>Nouveau mot de passe</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            autoCorrect={false}
          />

          <Text style={styles.label}>Confirmation du nouveau mot de passe</Text>
          <TextInput
            value={newPasswordConfirmation}
            onChangeText={setNewPasswordConfirmation}
            autoCorrect={false}
          />

          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
          <Spacer>
            <ButtonUi center title="Mettre à jour" loader={isLoading} onPress={() => tryUpdate()} />
          </Spacer>
        </View>
      </KeyboardAwareScrollView>
    </ThemedPage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    marginTop: 0,
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
  label: {
    paddingLeft: 10,
    fontWeight: "bold",
  },
});

export default AccountScreen;
