import {createMuiTheme, CssBaseline, StylesProvider, ThemeProvider, useMediaQuery} from '@material-ui/core';
import React, {useMemo} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
// Fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Header from "./components/sections/Header";
import Footer from "./components/sections/Footer";
// PNotify
import '@pnotify/core/dist/Material.css';
import 'material-design-icons/iconfont/material-icons.css';
import {defaults} from '@pnotify/core';
import Leaflet from "./pages/Leaflet";
import LandingPage from "./pages/LandingPage/LandingPage";
import ChallengeList from "./pages/ChallengeList";
import {AuthProvider} from "./components/security/useAuth";
import Signin from "./components/security/Signin";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from 'react-query/devtools'
import ChallengeEditor from './pages/ChallengeEditor';
import Signup from './components/security/Signup'


defaults.styling = 'material';
defaults.icons = 'material';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          mode: prefersDarkMode ? 'light' : 'dark',
          //mode: 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <div className="App">
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Main/>
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
}

export default App;

const queryClient = new QueryClient();


const Main = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>

          <div className="App">
            <CssBaseline/>
            <Header/>
            <Switch>
              <Route path="/signin"><Signin /></Route>
              <Route path="/signup"><Signup /></Route>
              <Route path="/challenges/:id"><Leaflet/></Route>
              <Route path="/challenges"><ChallengeList/></Route>
              <Route path="/challenge-editor"><ChallengeEditor /></Route>
              <Route path="/"><LandingPage/></Route>
            </Switch>
            <Footer/>
          </div>
          <ReactQueryDevtools initialIsOpen/>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}
