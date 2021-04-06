import * as React from 'react'
import Routing from './Routing';
import {makeStyles} from "@material-ui/core/styles";
import {
  AppBar, BottomNavigation, BottomNavigationAction, Box,
  Button, ButtonGroup,
  Divider,
  Drawer, Hidden,
  IconButton,
  List,
  ListItem, ListItemText, Paper, SwipeableDrawer,
  Theme,
  Toolbar,
  Typography, useMediaQuery, useTheme
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
import {useChangeTheme} from "../../../themes/CustomThemeProvider";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Brightness4Icon from "@material-ui/icons/Brightness4";
import {SupportAgent} from "@material-ui/icons";
import Header from "./Header";
import SidebarMobileMenu from "./SidebarMobileMenu";
import SidebarMenu from "./SidebarMenu";
import BottomMobileMenu from "../BottomMobileMenu";
import AccountSidebar from "./AccountSidebar";

export const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  hide: {
    display: 'none',
  },


  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('sm')]: {
      marginLeft: -drawerWidth,
    }
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  listItemSelected: {
    backgroundColor: theme.palette.secondary.main,
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
    }
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
}))

const Main = () => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [openMobile, setOpenMobile] = useState(false)
  const [openAccountDrawer, setOpenAccountDrawer] = useState(false)
  const changeTheme = useChangeTheme()
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
      changeTheme('light');
    } else {
      changeTheme('dark');
    }
  }


  const matches = useMediaQuery(theme.breakpoints.up('sm'))
  useEffect(() => {
    if (matches) {
      setOpen(true)
    } else {
      if (open) {
        setOpen(false)
      }
    }
  }, [matches])

  const toggleDrawerMobile = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setOpenMobile(open)
  };

  const toggleDrawerAccount = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setOpenAccountDrawer(open)
  };

  const drawerContent = (
    <>
      <Typography variant="button" ml={1}>
        Partie utilisateur
      </Typography>
      <Divider/>
      <List>
        <ListItem exact button component={NavLink} to="/ucp" activeClassName={classes.listItemSelected}>
          <ListItemIcon><HomeRoundedIcon htmlColor={theme.palette.common.white}/></ListItemIcon>
          <ListItemText>Accueil</ListItemText>
        </ListItem>
        <ListItem button component={NavLink} to="/ucp/changelogs" activeClassName={classes.listItemSelected}>
          <ListItemIcon><UpdateIcon htmlColor={theme.palette.common.white}/></ListItemIcon>
          <ListItemText>Mon historique</ListItemText>
        </ListItem>
      </List>
      <Typography variant="button" ml={1}>
        Partie administrateur
      </Typography>
      <Divider/>
      <List>
        <ListItem button component={NavLink} to="/ucp/challenges" activeClassName={classes.listItemSelected}>
          <ListItemIcon><AccessibilityRoundedIcon htmlColor={theme.palette.common.white}/></ListItemIcon>
          <ListItemText>Liste des challenges</ListItemText>
        </ListItem>
      </List>
      <Typography variant="button" ml={1}>
        Divers
      </Typography>
      <Divider/>
      <List>
        <ListItem button component={NavLink} to="/ucp/support" activeClassName={classes.listItemSelected}>
          <ListItemIcon><ContactSupportRoundedIcon htmlColor={theme.palette.common.white}/></ListItemIcon>
          <ListItemText>Support</ListItemText>
        </ListItem>
        <ListItem button component={NavLink} to="/">
          <ListItemIcon><ChevronLeftIcon htmlColor={theme.palette.common.white}/></ListItemIcon>
          <ListItemText>Page d'accueil</ListItemText>
        </ListItem>
      </List>
    </>
  )

  return (
    <div className={classes.root}>
      <Header sidebarOpen={open} onMenuClick={() => setOpen(true)} onAccountClick={() => setOpenAccountDrawer(true)}/>
      <AccountSidebar open={openAccountDrawer} onClose={toggleDrawerAccount(false)} />
      <Hidden smDown implementation="css">
        <SidebarMenu open={open} onCloseMenuClick={() => setOpen(false)}>{drawerContent}</SidebarMenu>
      </Hidden>
      <Hidden smUp implementation="css">
        <SidebarMobileMenu open={openMobile} onClose={toggleDrawerMobile(false)} onOpen={toggleDrawerMobile(true)}>{drawerContent}</SidebarMobileMenu>
        <BottomMobileMenu onSidebarMobileMenuClick={() => setOpenMobile(true)} />
      </Hidden>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open
        })}>
        <div className={classes.drawerHeader}/>
        <Routing/>
      </main>
    </div>
  )
}

export default Main