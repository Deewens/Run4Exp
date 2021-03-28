import * as React from 'react';
import {Divider, Drawer, Fab, IconButton, TextField, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Toolbar} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: 300,
    margin: theme.spacing(1),
  },
  drawerPaper: {
    width: 300,
    boxSizing: 'border-box',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(1),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  openDrawerBtnContainer: {
    top: '70px',
    cursor: 'pointer',
    position: 'absolute',
    width: '56px',
    right: '0',
    marginRight: '10px',
    overflow: 'hidden',
  },
  openDrawerIconContainer: {
    right: '-24px',
    '&:hover': {
      right: '0',
    },
    transition: 'all .3s cubic-bezier(.4,0,.2,1)',
    position: 'relative',
  },
  openDrawerIcon: {
    borderRadius: '50px',
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    margin: '8px 0 8px 8px',
    padding: '10px 0 10px 10px',
    width: 'calc(56px - 8px - 10px)',
    left: '0',
    top: '0',
    boxShadow: '0 1px 1px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)',

  },
  openDrawerShadow: {
  }
}));

const SideSheet = () => {
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
      <div aria-label="Ouvrir le panneau" className={classes.openDrawerBtnContainer} >
        <div className={classes.openDrawerIconContainer}>
          <div className={classes.openDrawerIcon} onClick={handleDrawerOpen}>
            <ChevronLeftIcon/>
          </div>
        </div>
      </div>
      <Drawer
        className={classes.root}
        anchor="right"
        open={open}
        variant="persistent"
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <Toolbar/>
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon/>
          </IconButton>
        </div>
        <Divider/>
        <div className={classes.form}>
          <form noValidate autoComplete="off">
            <TextField id="standard-basic" label="Nom du challenge" variant="standard"/>
          </form>
        </div>
        <Divider/>

      </Drawer>
    </>
  )
}

export default SideSheet;