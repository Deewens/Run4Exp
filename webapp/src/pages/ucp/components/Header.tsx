import clsx from "clsx";
import {AppBar, IconButton, Theme, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import * as React from "react";
import {makeStyles} from "@material-ui/core/styles";

export const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    [theme.breakpoints.up('sm')]: {
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
      display: 'none',
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

  return (
    <AppBar
      color="transparent"
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
          <MenuIcon/>
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
          Tableau de bord - Acrobatt
        </Typography>
        <nav>
          <IconButton aria-label="Mon compte" onClick={onAccountClick}><AccountCircleIcon/></IconButton>
        </nav>
      </Toolbar>
    </AppBar>
  )
}