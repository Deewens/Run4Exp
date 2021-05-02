import * as React from 'react'
import AppBar from '@material-ui/core/AppBar'
import {
  Button,
  ButtonGroup,
  createStyles,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  Typography,
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

  const auth = useAuth()

  const changeTheme = useChangeTheme()
  const theme = useTheme();

  const location = useLocation();
  const [mustChangeOnScroll, setChangeOnScroll] = useState(false);
  let trigger = useScrollTrigger({disableHysteresis: true, threshold: 401});
  const [headerStyle, setHeaderStyle] = useState<string>("white");
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);

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
                <Button exact component={NavLink} to="/">Présentation</Button>
                <Button exact component={NavLink} to="/">Diaporama</Button>
                {!auth.user && <Button exact component={NavLink} to="/signup">S'inscrire</Button>}
                <IconButton aria-label="Mon compte"
                            onClick={handleAccountClick}><AccountCircleIcon/><ArrowDropDownIcon/></IconButton>
                <IconButton aria-label="Theme switching" onClick={handleThemeSwitch}><Brightness4Icon/></IconButton>
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
                  {auth.user &&<MenuItem component={NavLink} to="/ucp" onClick={handleClose}>Mon compte</MenuItem>}
                  {auth.user &&<MenuItem onClick={handleSignout}>Se déconnecter</MenuItem>}
                  {!auth.user &&<MenuItem component={NavLink} to="/signin" onClick={handleClose}><ExitToAppIcon/>&nbsp; Se connecter</MenuItem>}
                </Menu>
              </div>
            </nav>
          </Toolbar>
        </AppBar>
        {mustChangeOnScroll ? null : <div className={classes.offset}/>}
      </header>
    </>
  )
}

export default Header;