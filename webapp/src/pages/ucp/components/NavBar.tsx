import * as React from "react";
import {
  AppBar, Button,
  Divider, Drawer, Hidden,
  IconButton, List, ListItem, ListItemText, Theme,
  Toolbar,
  Typography, useMediaQuery,
  useTheme
} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import {NavLink, useLocation} from 'react-router-dom'
import {useContext, useEffect, useMemo, useState} from "react"
import {CustomThemeContext} from "../../../themes/CustomThemeProvider"
import clsx from "clsx";
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import AccessibilityRoundedIcon from '@material-ui/icons/AccessibilityRounded';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import ContactSupportRoundedIcon from '@material-ui/icons/ContactSupportRounded';
import UpdateIcon from '@material-ui/icons/Update';
import {useAuth} from "../../../hooks/useAuth";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })
  },
  appBarShift: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
    },
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerPaper: {
    boxSizing: 'border-box',
    width: drawerWidth,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}))

const Header = () => {
  const classes = useStyles()

  const setThemeName = useContext(CustomThemeContext)
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null)

  const location = useLocation();
  useEffect(() => {
    if (location.pathname == '/ucp/challenge-editor/1') {
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

  const handleAccountClick = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAccountMenuAnchor(null);
  };

  const [open, setOpen] = useState(false)
  const [openMobile, setOpenMobile] = useState(false)

  useEffect(() => {
    // if (matches) {
    //   setOpen(true)
    //   if (openMobile) {
    //     setOpenMobile(false)
    //     setOpen(true)
    //   }
    // } else {
    //   if (open) {
    //     setOpen(false)
    //     setOpenMobile(true)
    //   }
    // }
  }, [matches])

  const drawerContent = useMemo(() => (
    <>
      <div className={classes.toolbar}>
        <Hidden smUp implementation="css">
        </Hidden>

        <Hidden smDown implementation="css">
          <Button onClick={() => setOpen(false)} color="inherit">
            <ChevronLeftIcon/> Fermer le menu
          </Button>
        </Hidden>
      </div>
      <Divider/>
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
    </>
  ), [])

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <Hidden smDown implementation="css">
            <IconButton
              color="inherit"
              aria-label="Ouvrir le panneau"
              onClick={() => setOpen(true)}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon/>
            </IconButton>
          </Hidden>
          <Typography variant="h6" noWrap component="div">
            Tableau de bord - Acrobatt
          </Typography>
        </Toolbar>
      </AppBar>
      <nav>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              })
            }}
          >
            {drawerContent}
          </Drawer>
        </Hidden>
      </nav>
    </>
  )
}

export default Header;