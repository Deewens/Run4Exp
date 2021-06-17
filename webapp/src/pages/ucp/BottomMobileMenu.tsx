import {BottomNavigation, BottomNavigationAction, Paper} from "@material-ui/core";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import {NavLink} from "react-router-dom";
import AccessibilityRoundedIcon from "@material-ui/icons/AccessibilityRounded";
import {SupportAgent} from "@material-ui/icons";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import * as React from "react";
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import ExploreIcon from "@material-ui/icons/Explore";



type Props = {
  onSidebarMobileMenuClick: () => void
}

export default function BottomMobileMenu(props: Props) {
  const {
    onSidebarMobileMenuClick
  } = props

  return (
    <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
      <BottomNavigation showLabels value={0}>
        <BottomNavigationAction icon={<HomeRoundedIcon/>} component={NavLink} to="/ucp"/>
        <BottomNavigationAction icon={<DirectionsRunIcon/>} component={NavLink} to="/ucp/my-challenges"/>
        <BottomNavigationAction icon={<ExploreIcon/>} component={NavLink} to="/ucp/find-challenge" />
        <BottomNavigationAction icon={<MoreVertIcon/>} onClick={onSidebarMobileMenuClick}/>
      </BottomNavigation>
    </Paper>
  )
}