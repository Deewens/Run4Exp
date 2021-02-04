import * as React from 'react';
import './App.css';
import {createMuiTheme, CssBaseline, StylesProvider, ThemeProvider, useMediaQuery} from '@material-ui/core';
import Header from './components/sections/Header';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import LandingPage from "./pages/LandingPage/LandingPage";
import {useMemo} from "react";
import Footer from "./components/sections/Footer";
import Draw from "./pages/DrawTest";

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
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Router>
          <div className="App">
            <CssBaseline/>
            <Header/>
            <Switch>
              <Route path="/draw"><Draw/></Route>
              <Route path="/"><LandingPage/></Route>
            </Switch>
            <Footer/>
          </div>
        </Router>
      </ThemeProvider>
    </StylesProvider>
  );
}

export default App;
