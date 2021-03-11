import * as React from 'react';
import {Divider, Drawer, Fab, IconButton, TextField, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Toolbar} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from "clsx";

const drawerHeight = 240;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: 300,
    margin: theme.spacing(1),
  },
  drawer: {
    height: drawerHeight,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
  },
  drawerOpen: {
    height: drawerHeight,
    transition: theme.transitions.create('height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowY: 'hidden',
    height: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      height: `calc(${theme.spacing(9)} + 1px)`,
    },
  },
}));

const BottomSheet = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  }

  return (
    <>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        anchor="bottom"
        open={open}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >

      </Drawer>
    </>
  )
}

export default BottomSheet