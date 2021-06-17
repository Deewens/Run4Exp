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
    let responseSession = await UserSessionApi.userSession(sessionId);
    setEvents(responseSession.data.events);
  };

  useEffect(() => {
    readData();
  }, []);

  return (
    <ThemedPage title="Historique" showUser={false} showReturn={true} onReturnPress={() => navigation.navigate("Activities")}>

      {events.length == 0 ? <Text>Aucun historique pour ce challenge</Text> :
        events.map(function (event, key) {
          {
            events.sort(function (a, b) {
              return a.advancement - b.advancement
            })
          }
          return <UserSesssion key={key} event={event} />;
        })}
    </ThemedPage>
  );
};

export default HistoryScreen;
