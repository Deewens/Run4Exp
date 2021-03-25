import React from "react";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { useColorScheme } from "react-native-appearance";
import {ThemeProvider} from 'react-native-elements'
import { DarkerTheme, LightTheme } from './src/styles/theme'
import { StatusBar } from "react-native";
import Navigation from './Navigation'

export default () => {
const scheme = useColorScheme();

return (
    <AuthProvider>
      <ThemeProvider theme={scheme === "dark" ? DarkerTheme : LightTheme }>
      <StatusBar
        barStyle="dark-content"
        backgroundColor='#0AA000'
        translucent={false} />

        <Navigation/>
        
      </ThemeProvider>
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