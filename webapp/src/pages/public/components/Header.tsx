import * as React from 'react'
import AppBar from '@material-ui/core/AppBar'
import {
  Accordion,
  Box,
  Button,
  ButtonGroup, Collapse,
  createStyles,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  Typography, useMediaQuery,
  useScrollTrigger,
  useTheme
} from '@material-ui/core'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import {NavLink, useLocation} from 'react-router-dom'
import clsx from 'clsx'
import {useAuth} from "../../../hooks/useAuth"
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import {useContext, useEffect, useState} from "react"
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import {useChangeTheme} from "../../../themes/CustomThemeProvider";
import Logo from '../../../images/acrobbatt-icon-green-1.png'
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme: Theme) => ({
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
      zIndex: theme.zIndex.drawer + 1,
      color: "#555",
      boxShadow:
        "0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15)",
      transition: "all 150ms ease 0s",
      userSelect: 'none'
    },
    headerBlack: {
      border: "0",
      color: "white",
      boxShadow: "0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15)",
      backgroundColor: theme.palette.primary.main,
    },
    headerTransparent: {
      backgroundColor: "transparent !important",
      boxShadow: "none",
      paddingTop: "20px",
      color: "black",
    },
    offset: theme.mixins.toolbar,
  }),
);

const Header = () => {
  const classes = useStyles();

  const auth = useAuth()

  const changeTheme = useChangeTheme()
  const theme = useTheme();

  const location = useLocation();
  const [mustChangeOnScroll, setChangeOnScroll] = useState(false);
  let trigger = useScrollTrigger({disableHysteresis: true, threshold: 200});
  const [headerStyle, setHeaderStyle] = useState<string>("white");
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);
  const [accountMobileMenuAnchor, setAccountMobileMenuAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (location.pathname == '/') {
      setHeaderStyle("transparent")
      setChangeOnScroll(true);
    } else {
      setChangeOnScroll(false);
      setHeaderStyle("white");
    }
  }, [location]);


  useEffect(() => {
    if (mustChangeOnScroll) {
      if (trigger) {
        setHeaderStyle("white");
      } else {
        setHeaderStyle("transparent");
      }
    }
  }, [trigger]);

  const handleThemeSwitch = () => {
    console.log(theme.palette.mode)
    if (theme.palette.mode == 'dark') {
      document.cookie = `paletteMode=light;path=/;max-age=31536000`
      changeTheme('light')
    } else {
      document.cookie = `paletteMode=dark;path=/;max-age=31536000`
      changeTheme('dark')
    }
  }

  const matches = useMediaQuery(theme.breakpoints.up('md'))
  useEffect(() => {
    if (matches) {
      setOpenMobileMenu(false)
      setAccountMobileMenuAnchor(null)
    } else {
      if (openMobileMenu) {
        setOpenMobileMenu(false)
        setAccountMobileMenuAnchor(null)
      }
    }
  }, [matches])

  const handleAccountClick = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAccountMenuAnchor(null);
  };

  const handleSignout = () => {
    auth.signout()
    setAccountMenuAnchor(null)
  }

  const [openMobileMenu, setOpenMobileMenu] = useState(false)

  return (
    <>
      <header className={classes.root}>
        <AppBar position="fixed" className={
          clsx(classes.header,
            {
              [classes.headerBlack]: headerStyle === "white",
              [classes.headerTransparent]: headerStyle === "transparent",
            })
        }
        >
          <Box
            sx={{
              display: {xs: 'none', md: 'block',}
            }}
          >
            <Toolbar>
              <Typography variant="h4" className={classes.title} component="div" align="left"
                          sx={{display: 'flex', alignItems: 'center', fontWeight: 'bold',}}>
                <img src={Logo} alt="Logo" style={{height: '40px', marginRight: 10}} /> Run4Exp
              </Typography>

              <nav>
                <ButtonGroup variant="text" color="inherit" size="large">
                  <Button exact component={NavLink} to="/" sx={{
                    border: 'none !important',
                    '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.5)', filter: 'backdropBlur(5px)',}
                  }}>Accueil</Button>
                  <Button exact component={NavLink} to="/" sx={{
                    border: 'none !important',
                    '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.5)', filter: 'backdropBlur(5px)',}
                  }}>Présentation</Button>
                  <Button exact component={NavLink} to="/" sx={{
                    border: 'none !important',
                    '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.5)', filter: 'backdropBlur(5px)',}
                  }}>Diaporama</Button>
                  {!auth.user && <Button exact component={NavLink} to="/signup" sx={{
                    border: 'none !important',
                    '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.5)', filter: 'backdropBlur(5px)',}
                  }}>S'inscrire</Button>}
                  <IconButton aria-label="Mon compte"
                              onClick={handleAccountClick}><AccountCircleIcon /><ArrowDropDownIcon /></IconButton>
                </ButtonGroup>

                <div>
                  <Menu
                    id="profile-men"
                    anchorEl={accountMenuAnchor}
                    open={Boolean(accountMenuAnchor)}
                    onClose={handleClose}
                    keepMounted
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left'
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                  >

                    {auth.user && <MenuItem component={NavLink} to="/ucp" onClick={handleClose}>Panel</MenuItem>}
                    {auth.user && <MenuItem component={NavLink} to="/ucp" onClick={handleClose}>Mon compte</MenuItem>}
                    {auth.user && <MenuItem onClick={handleSignout}>Se déconnecter</MenuItem>}
                    {!auth.user &&
                    <MenuItem component={NavLink} to="/signin" onClick={handleClose}><ExitToAppIcon />&nbsp; Se
                        connecter</MenuItem>}
                  </Menu>
                </div>
              </nav>
            </Toolbar>
          </Box>


          <Box
            sx={{
              display: {xs: 'block', md: 'none',}
            }}
          >
            <Toolbar>
              <Typography variant="h4" className={classes.title} component="div" align="left"
                          sx={{display: 'flex', alignItems: 'center', fontWeight: 'bold',}}>
                <img src={Logo} alt="Logo" style={{height: '40px', marginRight: 10}} /> Run4Exp
              </Typography>

              <IconButton
                color="inherit"
                aria-label="Ouvrir le panneau"
                edge="start"
                onClick={() => setOpenMobileMenu(old => !old)}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </Box>
        </AppBar>
        <Collapse
          in={openMobileMenu}
          sx={{
            position: 'fixed',
            zIndex: theme.zIndex.appBar-1,
            width: '100%',
          }}
        >
          <Box
            component="nav"
            sx={{

              backgroundColor: theme.palette.primary.main,
              pt: '75px',
            }}
          >
            <ButtonGroup
              variant="text"
              color="inherit"
              size="large"
              orientation="vertical"
              sx={{
                margin: '0 auto',
                width: '100%',
                color: '#fff',
              }}
            >
              <Button exact component={NavLink} to="/" sx={{
                border: 'none !important',
                '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.5)', filter: 'backdropBlur(5px)',
                color: '#fff',}
              }}>Accueil</Button>
              <Button exact component={NavLink} to="/" sx={{
                border: 'none !important',
                '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.5)', filter: 'backdropBlur(5px)',}
              }}>Présentation</Button>
              <Button exact component={NavLink} to="/" sx={{
                border: 'none !important',
                '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.5)', filter: 'backdropBlur(5px)',}
              }}>Diaporama</Button>
              {!auth.user && <Button exact component={NavLink} to="/signup" sx={{
                border: 'none !important',
                '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.5)', filter: 'backdropBlur(5px)',}
              }}>S'inscrire</Button>}
              <IconButton aria-label="Mon compte"
                          onClick={(e) => setAccountMobileMenuAnchor(e.currentTarget)}><AccountCircleIcon /><ArrowDropDownIcon /></IconButton>
            </ButtonGroup>
            <div>
              <Menu
                id="profile-men"
                anchorEl={accountMobileMenuAnchor}
                open={Boolean(accountMobileMenuAnchor)}
                onClose={() => setAccountMobileMenuAnchor(null)}
                keepMounted
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >

                {auth.user && <MenuItem component={NavLink} to="/ucp" onClick={handleClose}>Panel</MenuItem>}
                {auth.user && <MenuItem component={NavLink} to="/ucp" onClick={handleClose}>Mon compte</MenuItem>}
                {auth.user && <MenuItem onClick={handleSignout}>Se déconnecter</MenuItem>}
                {!auth.user &&
                <MenuItem component={NavLink} to="/signin" onClick={handleClose}><ExitToAppIcon />&nbsp; Se
                    connecter</MenuItem>}
              </Menu>
            </div>
          </Box>
        </Collapse>
        {mustChangeOnScroll ? null : <div className={classes.offset} />}
      </header>
    </>
  )
}

export default Header;