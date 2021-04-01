import React from "react";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import Navigation from './Navigation'
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

// export default function App() {
//   const handlePress = () => console.log("pressed");

//   return (
//     <View style={styles.container}>
//       <Text onPress={(handlePress)}>OEZpp!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }