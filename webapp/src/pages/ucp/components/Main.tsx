import * as React from 'react'
import NavBar from "./NavBar";
import Routing from './Routing';
import {makeStyles} from "@material-ui/core/styles";
import {Theme} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
  toolbar: {
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
  },
}))

const Main = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <NavBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Routing/>
      </main>
    </div>
  )
}

export default Main