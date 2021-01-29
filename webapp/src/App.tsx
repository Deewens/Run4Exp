import * as React from 'react';
import './App.css';
import {createMuiTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@material-ui/core';
import Header from './components/sections/Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LandingPage from "./pages/LandingPage/LandingPage";
import {useMemo} from "react";
import Footer from "./components/sections/Footer";

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          //mode: prefersDarkMode ? 'dark' : 'light',
          mode: 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <CssBaseline />
          <Header />
          <Switch>
            <Route path="/"><LandingPage /></Route>
          </Switch>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
