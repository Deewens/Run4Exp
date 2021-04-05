import {createMuiTheme, CssBaseline, StylesProvider, ThemeProvider, useMediaQuery} from '@material-ui/core';
import * as React from 'react'
import {lazy, Suspense, useMemo} from 'react';
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
import CustomThemeProvider from "./themes/CustomThemeProvider";
import ProtectedRoute from "./pages/shared/components/ProtectedRoute";

defaults.styling = 'material';
defaults.icons = 'material';

const queryClient = new QueryClient();

const UcpComponent = lazy(() => import("./pages/ucp/components/Main"));

const LandingComponent = lazy(() => import("./pages/public/components/Main"));

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <StylesProvider injectFirst>
          <CustomThemeProvider>
            <SnackbarProvider>
              <AuthProvider>
                <CssBaseline/>
                <Router>
                  <Suspense fallback={<></>}>
                    <Switch>
                      <ProtectedRoute path="/ucp">
                        <UcpComponent/>
                      </ProtectedRoute>
                      <Route>
                        <LandingComponent/>
                      </Route>
                    </Switch>
                  </Suspense>
                </Router>
              </AuthProvider>
            </SnackbarProvider>
          </CustomThemeProvider>
        </StylesProvider>
        <ReactQueryDevtools initialIsOpen/>
      </QueryClientProvider>
    </div>
  );
}

export default App
