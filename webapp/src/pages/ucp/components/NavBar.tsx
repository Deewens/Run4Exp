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
import clsx from "clsx";
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import AccessibilityRoundedIcon from '@material-ui/icons/AccessibilityRounded'
import HomeRoundedIcon from '@material-ui/icons/HomeRounded'
import ContactSupportRoundedIcon from '@material-ui/icons/ContactSupportRounded'
import UpdateIcon from '@material-ui/icons/Update'
import {useAuth} from "../../../hooks/useAuth"
import {useChangeTheme} from "../../../themes/CustomThemeProvider";

export const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) => ({
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
}))

const Header = () => {
  const classes = useStyles()

  const changeTheme = useChangeTheme()
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
      changeTheme('light');
    } else {
      changeTheme('dark');
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

  return (
    <>
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
    </>
    // <>
    //   <AppBar
    //     position="fixed"
    //     className={clsx(classes.appBar, {
    //       [classes.appBarShift]: open,
    //     })}
    //   >
    //     <Toolbar>
    //       <Hidden smDown implementation="css">
    //         <IconButton
    //           color="inherit"
    //           aria-label="Ouvrir le panneau"
    //           onClick={() => setOpen(true)}
    //           edge="start"
    //           className={clsx(classes.menuButton, {
    //             [classes.hide]: open,
    //           })}
    //         >
    //           <MenuIcon/>
    //         </IconButton>
    //       </Hidden>
    //       <Typography variant="h6" noWrap component="div">
    //         Tableau de bord - Acrobatt
    //       </Typography>
    //     </Toolbar>
    //   </AppBar>
    //   <nav>
    //     <Hidden smDown implementation="css">
    //       <Drawer
    //         variant="permanent"
    //         className={clsx(classes.drawer, {
    //           [classes.drawerOpen]: open,
    //           [classes.drawerClose]: !open,
    //         })}
    //         classes={{
    //           paper: clsx({
    //             [classes.drawerOpen]: open,
    //             [classes.drawerClose]: !open,
    //           })
    //         }}
    //       >
    //         {drawerContent}
    //       </Drawer>
    //     </Hidden>
    //   </nav>
    // </>
  )
}

export default Header;