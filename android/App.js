import React from 'react';
import { Provider as AuthProvider } from './src/context/AuthContext';
import Navigation from './src/navigation'
import ResolveAuthScreen from './src/screens/ResolveAuthScreen'
import ThemeManager from './src/styles/index'

export default () => {

  return (
    <AuthProvider>
      <ResolveAuthScreen />
      <ThemeManager>

        <Navigation />

      </ThemeManager>
    </AuthProvider>
  );
};