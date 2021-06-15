import clsx from "clsx";
import {AppBar, Box, IconButton, Menu, MenuItem, Theme, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import * as React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {NavLink} from "react-router-dom";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import {useState} from "react";
import {useAuth} from "../../../hooks/useAuth";
import LinearProgress from '@material-ui/core/LinearProgress';
import {useIsFetching} from "react-query";

export const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
  },
  hide: {
    display: 'none',
  },
}))

type Props = {
  sidebarOpen: boolean
  onMenuClick?: () => void
  onAccountClick?: () => void
}

export default function Header(props: Props) {
  const {
    sidebarOpen,
    onMenuClick,
    onAccountClick
  } = props

  const classes = useStyles()
  const {user, signout} = useAuth()

  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);

  const handleAccountClick = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleCloseAccountMenu = () => {
    setAccountMenuAnchor(null)
  }

  const handleSignout = () => {
    signout()
    handleCloseAccountMenu()
  }

  const isFetching = useIsFetching()

  return (
    <AppBar
      color="inherit"
      position="fixed"
      elevation={0}
      className={clsx(classes.appBar, {
        [classes.appBarShift]: sidebarOpen,
      })}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="Ouvrir le panneau"
          onClick={onMenuClick}
          edge="start"
          className={clsx(classes.menuButton, sidebarOpen && classes.hide)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
          Tableau de bord - Run4Exp
        </Typography>
        <nav>
          <IconButton aria-label="Mon compte" onClick={handleAccountClick}><AccountCircleIcon /></IconButton>
          <div>
            <Menu
              id="profile-men"
              anchorEl={accountMenuAnchor}
              open={Boolean(accountMenuAnchor)}
              onClose={handleCloseAccountMenu}
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

              {user && <MenuItem component={NavLink} to="/ucp/account-profile" onClick={handleCloseAccountMenu}>Mon
                  profil</MenuItem>}
              {user && <MenuItem onClick={handleSignout}>Se déconnecter</MenuItem>}
              {!user &&
              <MenuItem component={NavLink} to="/signin" onClick={handleCloseAccountMenu}><ExitToAppIcon />&nbsp; Se
                  connecter</MenuItem>}
            </Menu>
          </div>
        </nav>
      </Toolbar>

      {isFetching > 0 && (
        <Box sx={{width: '100%'}}>
          <LinearProgress aria-busy={isFetching > 0} />
        </Box>
      )}

    </AppBar>
  )
}