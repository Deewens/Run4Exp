import * as React from 'react'
import Routing from './Routing';
import {makeStyles} from "@material-ui/core/styles";
import {
  AppBar,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem, ListItemText,
  Theme,
  Toolbar,
  Typography, useTheme
} from "@material-ui/core";
import clsx from "clsx";
import {createContext, useContext, useEffect, useState} from "react";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import {NavLink, useLocation} from "react-router-dom";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import AccessibilityRoundedIcon from "@material-ui/icons/AccessibilityRounded";
import UpdateIcon from "@material-ui/icons/Update";
import ContactSupportRoundedIcon from "@material-ui/icons/ContactSupportRounded";
import {CustomThemeContext} from "../../../themes/CustomThemeProvider";

export const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}))

const Main = () => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const setThemeName = useContext(CustomThemeContext)
  const theme = useTheme()

  const location = useLocation();
  useEffect(() => {
    if (location.pathname.match('ucp\/challenge-editor\/[0-9]+')) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [location]);

  const handleThemeSwitch = () => {
    if (theme.palette.mode === 'dark') {
      setThemeName('lightTheme');
    } else {
      setThemeName('darkTheme');
    }
  }

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Ouvrir le panneau"
            onClick={() => setOpen(true)}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Tableau de bord - Acrobatt
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <Button onClick={() => setOpen(false)} color="inherit">
            <ChevronLeftIcon/> Fermer le menu
          </Button>
        </div>
        <Divider />
        <List>
          <ListItem button component={NavLink} to="/ucp">
            <ListItemIcon><HomeRoundedIcon/></ListItemIcon>
            <ListItemText>Accueil</ListItemText>
          </ListItem>
          <ListItem button component={NavLink} to="/ucp/challenges">
            <ListItemIcon><AccessibilityRoundedIcon/></ListItemIcon>
            <ListItemText>Liste des challenges</ListItemText>
          </ListItem>
        </List>
        <Divider/>
        <List>
          <ListItem button component={NavLink} to="/ucp/changelogs">
            <ListItemIcon><UpdateIcon/></ListItemIcon>
            <ListItemText>Mises à jours</ListItemText>
          </ListItem>
          <ListItem button component={NavLink} to="/ucp/support">
            <ListItemIcon><ContactSupportRoundedIcon/></ListItemIcon>
            <ListItemText>Support</ListItemText>
          </ListItem>
          <ListItem button component={NavLink} to="/">
            <ListItemIcon><ChevronLeftIcon/></ListItemIcon>
            <ListItemText>Page d'accueil</ListItemText>
          </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open
        })}>
        <div className={classes.drawerHeader} />
        <Routing/>
      </main>
    </div>
  )
}

export default Main