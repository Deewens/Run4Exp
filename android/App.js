import React from 'react';
import { Provider as AuthProvider } from './src/context/AuthContext';
import Navigation from './src/navigation'
import ResolveAuthScreen from './src/screens/ResolveAuthScreen'
import ResolveDatabases from './src/screens/ResolveDatabases'
import ThemeManager from './src/styles/index'

export default () => {

  return (
    <AuthProvider>
      <ResolveDatabases />
      <ResolveAuthScreen />
      <ThemeManager>

        <Navigation />

      </ThemeManager>
    </AuthProvider>
  );
};