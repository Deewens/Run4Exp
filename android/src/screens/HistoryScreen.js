import React, { useState, useEffect } from 'react';
import ThemedPage from '../components/ui/ThemedPage';
import UserSesssion from '../components/challenge/UserSession';
import UserSessionApi from '../api/user-session.api';
import { Text } from 'react-native-elements';
import Button from '../components/ui/Button';

const HistoryScreen = ({ navigation, route }) => {
  const { sessionId } = route.params;
  let [events, setEvents] = useState([]);

  const readData = async () => {
    let responseSession = await UserSessionApi.runs(sessionId);
    setEvents(responseSession.data);

  };

  useEffect(() => {
    readData();
  }, []);

  return (
    <ThemedPage title="Historique" onUserPress={() => navigation.openDrawer()}>
      <Button title="Retour" color="blue" onPress={() => navigation.navigate("Activities")} />

      {events.length == 0 ? <Text>Aucun historique pour ce challenge</Text> :
        events.map(function (event, key) {
          return <UserSesssion key={key} event={event} />;
        })}
    </ThemedPage>
  );
};

export default HistoryScreen;
