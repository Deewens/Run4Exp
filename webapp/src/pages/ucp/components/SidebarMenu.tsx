import {
  BottomNavigation,
  BottomNavigationAction,
  Button, Divider,
  Drawer,
  List, ListItem, ListItemText,
  Paper,
  SwipeableDrawer, Theme, Typography, useTheme
} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import {NavLink} from "react-router-dom";
import AccessibilityRoundedIcon from "@material-ui/icons/AccessibilityRounded";
import {SupportAgent} from "@material-ui/icons";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import * as React from "react";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import UpdateIcon from "@material-ui/icons/Update";
import ContactSupportRoundedIcon from "@material-ui/icons/ContactSupportRounded";
import {makeStyles} from "@material-ui/core/styles";
import {ReactNode} from "react";

export const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    boxSizing: 'border-box',
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
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
  children: ReactNode,
  open: boolean
  onCloseMenuClick: () => void
}

export default function SidebarMenu(props: Props) {
  const {
    children,
    open,
    onCloseMenuClick
  } = props

  const classes = useStyles()
  const theme = useTheme()

  return (
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
        <Button onClick={onCloseMenuClick} color="inherit">
          <ChevronLeftIcon/> Fermer le menu
        </Button>
      </div>
      {children}
    </Drawer>
  )
}