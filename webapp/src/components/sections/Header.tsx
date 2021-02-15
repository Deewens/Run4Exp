import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import {
  Button,
  ButtonGroup,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
  useScrollTrigger
} from '@material-ui/core';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import {NavLink, useLocation} from 'react-router-dom';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    header: {
      width: "100%",

      color: "#555",
      boxShadow:
        "0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15)",
      transition: "all 150ms ease 0s",
      userSelect: 'none'
    },
    headerBlack: {
      border: "0",
      color: "white",
      backgroundColor: "#0277bd",
      boxShadow:
        "0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15)"
    },
    headerTransparent: {
      backgroundColor: "transparent !important",
      boxShadow: "none",
      paddingTop: "20px",
      color: "white",
    },
    offset: theme.mixins.toolbar,
  }),
);

const Header = () => {
  const classes = useStyles();

  const location = useLocation();
  const [mustChangeOnScroll, setChangeOnScroll] = React.useState(false);
  let trigger = useScrollTrigger({disableHysteresis: true, threshold: 401});
  const [headerStyle, setHeaderStyle] = React.useState<string>("white");

  React.useEffect(() => {
    if (location.pathname == '/') {
      setHeaderStyle("transparent")
      setChangeOnScroll(true);
    }
    else {
      setChangeOnScroll(false);
      setHeaderStyle("white");
    }
  }, [location]);



  React.useEffect(() => {
    if (mustChangeOnScroll) {
      if (trigger) {
        setHeaderStyle("white");
      } else {
        setHeaderStyle("transparent");
      }
    }
  }, [trigger]);

  return (
    <>
      <header className={classes.root}>
        <AppBar position='fixed' className={
          clsx(classes.header,
            {
              [classes.headerBlack]: headerStyle === "white",
              [classes.headerTransparent]: headerStyle === "transparent",
            })
        }
        >
          <Toolbar>
            <Typography variant="h6" className={classes.title} component="div" align="left">
              Acrobatt
            </Typography>

            <nav>
              <ButtonGroup variant="text" color="inherit" size="large">
                <Button exact component={NavLink} to="/">Accueil</Button>
                <Button exact component={NavLink} to="/draw">Challenge</Button>
                <Button exact component={NavLink} to="/signin">Connexion</Button>
                <IconButton aria-label="Theme switching"><Brightness4Icon/></IconButton>
              </ButtonGroup>
            </nav>
          </Toolbar>
        </AppBar>
        {mustChangeOnScroll ? null : <div className={classes.offset} />}
      </header>

    </>
  )
}

export default Header;