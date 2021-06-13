import React, {useContext, useEffect, useState} from 'react'
import L from 'leaflet'
import Header from "./components/Header";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Theme,
  Typography,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import SidebarMenu from "./components/SidebarMenu";
import SidebarMobileMenu from "./components/SidebarMobileMenu";
import BottomMobileMenu from "./BottomMobileMenu";
import clsx from "clsx";
import Routing from "./components/Routing";
import {useChangeTheme} from "../../themes/CustomThemeProvider";
import {NavLink, useLocation} from "react-router-dom";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import ExploreIcon from "@material-ui/icons/Explore";
import UpdateIcon from "@material-ui/icons/Update";
import AccessibilityRoundedIcon from "@material-ui/icons/AccessibilityRounded";
import ContactSupportRoundedIcon from "@material-ui/icons/ContactSupportRounded";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import {makeStyles} from "@material-ui/core/styles";
import {useAuth} from "../../hooks/useAuth";

type MainContext = {
  open: boolean
  openMobile: boolean
  openAccountDrawer: boolean
  toggleSidebar(open: boolean): void
  toggleSidebarMobile(open: boolean): void
  toggleAccountDrawer(open: boolean): void
}

const MainContext = React.createContext<MainContext>({
  open: true,
  openAccountDrawer: false,
  openMobile: false,
  toggleAccountDrawer: () => console.warn("You need to use the provider"),
  toggleSidebar: () => console.warn("You need to use the provider"),
  toggleSidebarMobile: () => console.warn("You need to use the mobile provider"),
})

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
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
      width: `calc(100% - ${drawerWidth}px)`,
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

type Props = {
  children: React.ReactNode
}

export const MainProvider = (props: Props) => {
  const {
    children
  } = props

  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [openMobile, setOpenMobile] = useState(false)
  const [openAccountDrawer, setOpenAccountDrawer] = useState(false)
  const changeTheme = useChangeTheme()
  const theme = useTheme()

  const matches = useMediaQuery(theme.breakpoints.up('md'))
  useEffect(() => {
    if (matches) {
      setOpen(true)
    } else {
      if (open) {
        setOpen(false)
      }
    }
  }, [matches])

  // DEBUG
  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const md = useMediaQuery(theme.breakpoints.only('md'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  const isScreenWidthLow = useMediaQuery('(max-width: 1200px)')
  useEffect(() => {
    console.log('---------')
    console.log(`md: ${md}`)
    console.log(`sm: ${sm}`)
    console.log(`xs: ${xs}`)
    console.log(`isScreenWidthLow: ${isScreenWidthLow}`)
    if (isScreenWidthLow) setOpen(false)
  }, [sm, md, xs, isScreenWidthLow])

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

  const { user } = useAuth()

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
        <ListItem exact button component={NavLink} to="/ucp/my-challenges" activeClassName={classes.listItemSelected}>
          <ListItemIcon><ExploreIcon htmlColor={theme.palette.common.white}/></ListItemIcon>
          <ListItemText>Mes Challenges</ListItemText>
        </ListItem>
        <ListItem exact button component={NavLink} to="/ucp/find-challenge" activeClassName={classes.listItemSelected}>
          <ListItemIcon><ExploreIcon htmlColor={theme.palette.common.white} /></ListItemIcon>
          <ListItemText>Trouver un challenge</ListItemText>
        </ListItem>
      </List>
      {user?.superAdmin && (
        <>
          <Typography variant="button" ml={1}>
            Partie administrateur
          </Typography>
          <Divider/>
          <List>
            <ListItem button component={NavLink} to="/ucp/challenges" activeClassName={classes.listItemSelected}>
              <ListItemIcon><AccessibilityRoundedIcon htmlColor={theme.palette.common.white}/></ListItemIcon>
              <ListItemText>Éditeur de challenge</ListItemText>
            </ListItem>
            <ListItem button component={NavLink} to="/ucp/admin-published-challenges" activeClassName={classes.listItemSelected}>
              <ListItemIcon><AccessibilityRoundedIcon htmlColor={theme.palette.common.white}/></ListItemIcon>
              <ListItemText>Challenges publiés</ListItemText>
            </ListItem>
          </List>
        </>
      )}
      <Typography variant="button" ml={1}>
        Divers
      </Typography>
      <Divider/>
      <List>
        {/*<ListItem button component={NavLink} to="/ucp/support" activeClassName={classes.listItemSelected}>*/}
        {/*  <ListItemIcon><ContactSupportRoundedIcon htmlColor={theme.palette.common.white}/></ListItemIcon>*/}
        {/*  <ListItemText>Support</ListItemText>*/}
        {/*</ListItem>*/}
        <ListItem button component={NavLink} to="/">
          <ListItemIcon><ChevronLeftIcon htmlColor={theme.palette.common.white}/></ListItemIcon>
          <ListItemText>Quitter</ListItemText>
        </ListItem>
      </List>
    </>
  )

  const toggleSidebar = (open: boolean) => setOpen(open)
  const toggleSidebarMobile = (open: boolean) => setOpenMobile(open)
  const toggleAccountDrawer = (open: boolean) => setOpenAccountDrawer(open)

  return (
    <MainContext.Provider
      value={{
        open,
        openMobile,
        openAccountDrawer,
        toggleSidebar,
        toggleSidebarMobile,
        toggleAccountDrawer
      }}>

      <div className={classes.root}>
        <Header sidebarOpen={open} onMenuClick={() => setOpen(true)} onAccountClick={() => setOpenAccountDrawer(true)}/>
        <Box sx={{display: {xs: 'none', sm: 'block'}}}> {/* smDown */}
          <SidebarMenu open={open} onCloseMenuClick={() => setOpen(false)}>{drawerContent}</SidebarMenu>
        </Box>
        <Box sx={{display: {sm: 'none', xs: 'block'}}}> {/* smUp */}
          <SidebarMobileMenu open={openMobile} onClose={toggleDrawerMobile(false)}
                             onOpen={toggleDrawerMobile(true)}>{drawerContent}</SidebarMobileMenu>
          <BottomMobileMenu onSidebarMobileMenuClick={() => setOpenMobile(true)}/>
        </Box>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open
          })}>
          <div className={classes.drawerHeader}/>
          {children}
          <Box sx={{display: {xs: 'block', sm: 'none'}, minHeight: 48,}} /> {/* Content to be above appbar on mobile mode */}
        </main>
      </div>
    </MainContext.Provider>
  )
}

export default function useMain() {
  return useContext(MainContext)
}

