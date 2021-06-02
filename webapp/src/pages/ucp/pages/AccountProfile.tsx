import * as React from 'react'
import {makeStyles, TypographyVariant} from "@material-ui/core/styles";
import {Avatar, Button, Divider, Drawer, Skeleton, Theme, Typography} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {ChangeEvent, useEffect, useState} from "react";
import {useAuth} from "../../../hooks/useAuth";
import {User} from "../../../api/type";
import useSelfAvatar from "../../../api/useSelfAvatar";
import useUpdateUser, {UpdateUser} from "../../../api/useUpdateUser";
import useUploadUserAvatar from "../../../api/useUploadAvatar";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(4),
    display: 'flex',
    justifyContent: 'center',
  },
  formGroup: {
    border: '2px solid black',
  },
}))

export default function AccountProfile() {
  const classes = useStyles()

  const {user} = useAuth()
  const updateUser = useUpdateUser()

  const [email, setEmail] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')

  const [newPasswordError, setNewPasswordError] = useState(false)
  const [newPasswordHelper, setNewPasswordHelper] = useState('')

  useEffect(() => {
    if (user) {
      setEmail(user.email)
      setFirstname(user.firstName)
      setLastname(user.name)
    }
  }, [user])

  const handleUpdateProfile = () => {
    let formError = false

    let updateUserData: UpdateUser = {
      email,
      name: lastname,
      firstName: firstname,
      newPassword,
      newPasswordConfirmation: newPasswordConfirm,
      password: currentPassword,
    }

    if (newPassword === '') {
      updateUserData = {
        email,
        name: lastname,
        firstName: firstname,
        newPassword: currentPassword,
        newPasswordConfirmation: currentPassword,
        password: currentPassword,
      }
    } else {
      if (newPassword !== newPasswordConfirm) {
        formError = true;
        setNewPasswordError(true)
        setNewPasswordHelper('Les mots de passes ne correspondent pas.')
      }
    }

    if (!formError) {
      updateUser.mutate(updateUserData, {
        onError(error) {
          console.log()
          console.log(error.response?.data)
        },
        onSuccess(success) {
          console.log(success)
          console.log('Update success')
          setFirstname(success.firstName)
          setLastname(success.name)
          setEmail(success.email)
        }
      })
    }
  }

  const uploadAvatar = useUploadUserAvatar()

  const handleUploadAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      let file = e.target.files[0]
      let url = URL.createObjectURL(file)

      fetch(url)
        .then(res => res.blob())
        .then(blob => uploadAvatar.mutate({image: blob}, {
          onSuccess() {
            console.log('success upload')
          }
        }))
    }
  }

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <form>
          <Grid container spacing={2} direction="column">
            <Grid item container pb={2}>
              <Grid item md={4}>
                <Typography variant="h5">
                  Avatar
                </Typography>
                <Typography variant="subtitle1">
                  Uploader un nouvel avatar ici
                </Typography>
              </Grid>
              <Grid item md={8}>
                {user && <UserAvatar />}
                <input type="file" id="avatar" name="avatar" accept="image/jpeg" onChange={handleUploadAvatar}/>
              </Grid>
            </Grid>
            <Divider/>

            <Grid item container spacing={2} pb={2}>
              <Grid item md={4}>
                <Typography variant="h5">
                  Paramètres Généraux
                </Typography>
                <Typography variant="subtitle1">
                  blabla
                </Typography>
              </Grid>
              <Grid item xs={8} sm container direction="column" spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    type="email"
                    fullWidth
                    id="email"
                    label="E-mail"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    fullWidth
                    id="firstName"
                    label="Prénom"
                    autoFocus
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    autoComplete="lname"
                    name="lastName"
                    variant="outlined"
                    fullWidth
                    id="lastName"
                    label="Nom"
                    autoFocus
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Divider/>

            <Grid item container pb={2}>
              <Grid item md={4}>
                <Typography variant="h5">
                  Changement de mot de passe
                </Typography>
                <Typography variant="subtitle1">
                  Changer votre mot de passe ici
                </Typography>
              </Grid>
              <Grid item xs={8} sm container direction="column" spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    error={newPasswordError}
                    helperText={newPasswordHelper}
                    variant="outlined"
                    required
                    fullWidth
                    name="new-password"
                    label="Mot de passe"
                    type="password"
                    id="new-password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="new-password-confirm"
                    label="Confirmation du mot de passe"
                    type="password"
                    id="new-password-confirm"
                    autoComplete="new-password-password"
                    value={newPasswordConfirm}
                    onChange={e => setNewPasswordConfirm(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Divider/>

            <Grid item container>
              <Grid item md={4}>
                <Typography variant="h5">
                  Mot de passe actuel
                </Typography>
                <Typography variant="subtitle1">
                  Obligatoire pour modifier le profil
                </Typography>
              </Grid>
              <Grid item xs={8} sm container direction="column" spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="current-password"
                    label="Mot de passe"
                    type="password"
                    id="current-password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                  />
                </Grid>
                <Grid item sx={{display: 'flex', justifyContent: 'space-between'}}>
                  <Button>Annuler</Button>
                  <Button variant="contained" onClick={handleUpdateProfile}>Mettre à jour le profil</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Container>
    </div>
  )
}

const UserAvatar = () => {
  const avatar = useSelfAvatar()
  if (avatar.isSuccess && avatar.data) {
    return (
      <Avatar
        src={avatar.data}
        sx={{width: 66, height: 66}}
      />
    )
  }

  if (avatar.isLoading) {
    return <Skeleton variant="circular" width={66} height={66}/>
  }

  return (
    <Avatar
      sx={{width: 66, height: 66}}
    />
  )
}