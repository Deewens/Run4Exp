import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import Spacer from '../components/ui/Spacer';
import { Context } from '../context/AuthContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ThemedPage from '../components/ui/ThemedPage';
import TextInput from '../components/ui/TextInput';
import Button from '../components/ui/Button';
import Animated from 'react-native-reanimated';
import ButtonUi from '../components/ui/Button';

const AccountScreen = (props) => {
  const { state, update } = useContext(Context);
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
        var userObj = JSON.parse(userStore);
        setFirstName(userObj.firstName)
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
  useEffect(() => {
    readData();
  }, []);
  return (
    <ThemedPage title="Vos informations" showUser={false}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollview}>
        <View style={styles.inner}>
          <Animated.View style={[styles.buttonPause]}>
            <Button
              title="X"
              padding={10}
              width={50}
              color="red"
              onPress={() => props.navigation.navigate('Home')}
            />
          </Animated.View>

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
            secure={true}
            autoCorrect={false}
          />

          <Text style={styles.label}>Nouveau mot de passe</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            secure={true}
            autoCorrect={false}
          />

          <Text style={styles.label}>Confirmation du nouveau mot de passe</Text>
          <TextInput
            value={newPasswordConfirmation}
            onChangeText={setNewPasswordConfirmation}
            secure={true}
            autoCorrect={false}
          />

          {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}
          <Spacer>
            <ButtonUi center title="Mettre à jour" onPress={() => update({ firstName, name, email, password, newPassword, newPasswordConfirmation })} />
          </Spacer>
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
    marginTop: 0,
    padding: 18,
    flex: 1,
    justifyContent: "space-around"
  },
  buttonPause: {
    zIndex: -50,
    position: "absolute",
    width: "100%",
    left: 250,
    top: -10,
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
