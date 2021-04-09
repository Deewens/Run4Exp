import {Button, Drawer, Switch, Theme, Typography, useTheme} from "@material-ui/core";
import {useAuth} from "../../../hooks/useAuth";
import {useChangeTheme} from "../../../themes/CustomThemeProvider";
import {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import * as React from "react";

type Props = {
  open: boolean
  onClose(event: object): void
}

export const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  drawerPaper: {
    width: drawerWidth,
  },
  signoutBtn: {
    marginTop: 'auto',
  }
}))

export default function AccountSidebar(props: Props) {
  const {
    open,
    onClose,
  } = props
  const classes = useStyles()

  const {user, signout} = useAuth()
  const theme = useTheme()
  const changeTheme = useChangeTheme()

  const [paletteModeSwitchChecked, setPaletteModeSwitchChecked] = useState(theme.palette.mode === 'dark')

  return (
    <Drawer
      className={classes.root}
      anchor="right"
      open={open}
      onClose={onClose}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Typography align="center" alignItems="center" variant="h3" gutterBottom>
        {user?.firstName} {user?.name}
      </Typography>
      <Typography variant="subtitle1">
        Préférences
      </Typography>
      <Switch
        inputProps={{'aria-label': 'Dark mode'}}
        value={paletteModeSwitchChecked}
        onChange={(e) => changeTheme(e.target.checked ? 'dark' : 'light')}
        defaultChecked={theme.palette.mode === 'dark'}
      />
      <Button className={classes.signoutBtn} variant="contained" onClick={signout}>Déconnexion</Button>
    </Drawer>
  )
}