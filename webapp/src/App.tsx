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
import Header from "./pages/public/components/Header";
// PNotify
import '@pnotify/core/dist/Material.css';
import 'material-design-icons/iconfont/material-icons.css';
import {defaults} from '@pnotify/core';
import Leaflet from "./pages/ucp/components/Leaflet";
import LandingPage from "./pages/public/pages/LandingPage";
import ChallengeList from "./pages/ucp/pages/ChallengeList";
import {AuthProvider, useAuth} from "./hooks/useAuth";
import Signin from "./pages/public/pages/Signin";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from 'react-query/devtools'
import ChallengeEditor from './pages/ucp/pages/ChallengeEditor';
import Signup from './pages/public/pages/Signup'
import './api/axiosConfig'
import {SnackbarProvider} from "notistack";

defaults.styling = 'material';
defaults.icons = 'material';

const queryClient = new QueryClient();

console.log(process.env.REACT_APP_API_URL)

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
            <SnackbarProvider>
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
            </SnackbarProvider>
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
      render={({location}) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: {from: location}
            }}
          />
        )
      }
    />
  );
}
