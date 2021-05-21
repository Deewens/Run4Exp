import {BottomNavigation, BottomNavigationAction, Paper, SwipeableDrawer, Theme} from "@material-ui/core";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import {NavLink} from "react-router-dom";
import AccessibilityRoundedIcon from "@material-ui/icons/AccessibilityRounded";
import {SupportAgent} from "@material-ui/icons";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import * as React from "react";
import {ReactNode} from "react";
import {makeStyles} from "@material-ui/core/styles";

export const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  drawerPaper: {
    width: drawerWidth,
    boxSizing: 'border-box',
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
  },

}))

type Props = {
  children?: ReactNode
  open: boolean
  onClose(event: object): void
  onOpen(event: object): void
}

export default function SidebarMobileMenu(props: Props) {
  const {
    children,
    open,
    onClose,
    onOpen
  } = props
  const classes = useStyles()



  return (
    <SwipeableDrawer
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="right"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
    >
      {children}
    </SwipeableDrawer>
)
}