import {createMuiTheme, CssBaseline, StylesProvider, ThemeProvider, useMediaQuery} from '@material-ui/core';
import * as React from 'react'
import {useMemo} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteProps,
  Redirect,
} from "react-router-dom";
// Fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Header from "./components/sections/Header";
// PNotify
import '@pnotify/core/dist/Material.css';
import 'material-design-icons/iconfont/material-icons.css';
import {defaults} from '@pnotify/core';
import Leaflet from "./pages/Leaflet";
import LandingPage from "./pages/LandingPage/LandingPage";
import ChallengeList from "./pages/ChallengeList";
import {AuthProvider, useAuth} from "./hooks/useAuth";
import Signin from "./components/Signin";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from 'react-query/devtools'
import ChallengeEditor from './pages/ChallengeEditor';
import Signup from './components/Signup'
import './api/axiosConfig'

defaults.styling = 'material';
defaults.icons = 'material';

const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <StylesProvider injectFirst>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              <Router>
                <CssBaseline/>
                <Header/>
                <Switch>
                  <Route path="/signin"><Signin/></Route>
                  <Route path="/signup"><Signup/></Route>
                  <ProtectedRoute path="/challenges/:id"><Leaflet/></ProtectedRoute>
                  <ProtectedRoute path="/challenges"><ChallengeList/></ProtectedRoute>
                  <ProtectedRoute path="/challenge-editor/:id"><ChallengeEditor/></ProtectedRoute>
                  <Route path="/"><LandingPage/></Route>
                </Switch>
              </Router>
            </AuthProvider>
          </ThemeProvider>
        </StylesProvider>
        <ReactQueryDevtools initialIsOpen/>
      </QueryClientProvider>
    </div>
  );
}

export default App;

interface ProtectedRouteProps extends RouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({children, ...rest}: ProtectedRouteProps) => {
  const auth = useAuth()

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
