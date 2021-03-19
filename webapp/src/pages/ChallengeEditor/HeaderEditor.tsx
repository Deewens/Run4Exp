import * as React from 'react'
import {makeStyles} from "@material-ui/core/styles";
import {Drawer, Paper, TextField, Theme} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 45
  },
  formField: {
    backgroundColor: '#DDDDDD',
    width: 400,
    margin: '0 auto',
  },
}))

const HeaderEditor = () => {
  const classes = useStyles()

  return (
    <Paper className={classes.root}>
      <TextField className={classes.formField} fullWidth label="Nom du challenge" size="small" variant="filled" margin="dense"/>
    </Paper>
  )
}

export default HeaderEditor