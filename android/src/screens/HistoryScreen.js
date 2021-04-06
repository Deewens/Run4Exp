import React from 'react';
import { ThemedPage } from '../components/ui';

const HistoryScreen = ({ navigation }) => {

  return (
    <ThemedPage title="Historique" onUserPress={() => navigation.openDrawer()}>

    </ThemedPage>
  );
};

export default HistoryScreen;
