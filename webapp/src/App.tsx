import {createMuiTheme, CssBaseline, StylesProvider, useMediaQuery} from '@material-ui/core';
import StyledEngineProvider from '@material-ui/core/StyledEngineProvider';
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
import LandingPage from "./pages/public/pages/LandingPage";
import ChallengeList from "./pages/ucp/pages/AdminChallengeList";
import {AuthProvider, useAuth} from "./hooks/useAuth";
import Signin from "./pages/public/pages/Signin"
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from 'react-query/devtools'
import ChallengeEditor from './pages/ucp/pages/ChallengeEditor';
import Signup from './pages/public/pages/Signup'
import './api/axiosConfig'
import {SnackbarProvider} from "notistack";
import ProtectedRoute from "./pages/shared/components/ProtectedRoute";
import {ThemeProvider} from "./themes/CustomThemeProvider";

defaults.styling = 'material';
defaults.icons = 'material';

const queryClient = new QueryClient();

const UcpComponent = lazy(() => import("./pages/ucp/components/Main"));

const LandingComponent = lazy(() => import("./pages/public/components/Main"));

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider>
            <CssBaseline/>
            <SnackbarProvider>
              <AuthProvider>
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
          </ThemeProvider>
        </StyledEngineProvider>
        {/*<ReactQueryDevtools initialIsOpen/>*/}
      </QueryClientProvider>
    </div>
  );
}

export default App
