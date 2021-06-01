import {Avatar, Button, Drawer, Skeleton, Switch, Theme, Typography, useTheme} from "@material-ui/core";
import {useAuth} from "../../../hooks/useAuth";
import {useChangeTheme} from "../../../themes/CustomThemeProvider";
import {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import * as React from "react";
import useSelfAvatar from "../../../api/useSelfAvatar";
import {User} from "../../../api/type";

type Props = {
  open: boolean
  onClose(event: object): void
}

export const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  drawerPaper: {
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
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


  const handleThemeSwitch = () => {
    if (theme.palette.mode === 'dark') {
      changeTheme('light');
    } else {
      changeTheme('dark');
    }
  }

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
      {user && <UserAvatar user={user} />}
      <Typography align="center" alignItems="center" variant="h5" gutterBottom>
        {user?.firstName} {user?.name}
      </Typography>
      <Typography variant="subtitle1">
        Préférences
      </Typography>
      <Switch
        inputProps={{'aria-label': 'Dark mode'}}
        value={theme.palette.mode === 'dark'}
        onChange={(e) => changeTheme(theme.palette.mode === 'dark' ? 'light' : 'dark')}
        defaultChecked={theme.palette.mode === 'dark'}
      />
      <Button className={classes.signoutBtn} variant="contained" onClick={signout}>Déconnexion</Button>
    </Drawer>
  )
}

type AvatarProps = {
  user: User
}

const UserAvatar = (props: AvatarProps) => {
  const avatar = useSelfAvatar()
  if (avatar.isSuccess && avatar.data) {
    return (
      <Avatar
        src={avatar.data}
        sx={{width: 66, height: 66}}
      />
    )
  }

  if (avatar.isError) {
    return (
      <Avatar
        sx={{width: 66, height: 66}}
      />
    )
  }

  return <Skeleton variant="circular" width={66} height={66} />
}