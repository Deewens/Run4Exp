import * as React from 'react';
import {useState} from "react";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useSnackbar} from "notistack";


import {Alert} from "@material-ui/core";
import {useAuth} from "../hooks/useAuth";
import Copyright from "./Copyright";
import {useRouter} from "../hooks/useRouter";

const Signup = () => {
  const {signup} = useAuth()
  const {enqueueSnackbar} = useSnackbar()


  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  const classes = useStyles();

  let [firstname, setFirstName] = useState('');
  let [lastname, setLastName] = useState('');
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [passwordConfirm, setPasswordConfirm] = useState('');

  let [message, setMessage] = useState('');

  const router = useRouter()

  let handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    signup(lastname, firstname, email, password, passwordConfirm)
      .then(data => {
        enqueueSnackbar("Inscription réussie !", {
          variant: 'success'
        })

        router.push('/signin')
      })
      .catch(error => {
        enqueueSnackbar("Quelque chose s'est mal passé :( ! Corrigez les informations et réessayez !", {
          variant: 'error'
        })
        console.log(error)
      })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          S'inscrire
        </Typography>
        { message ? <Alert severity="error">{message}</Alert> : null}
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="E-mail"
                name="email"
                autoComplete="email"
                value={email}
                onChange={ e=>setEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={ e=>setPassword(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password-confirm"
                label="Confirmation du mot de passe"
                type="password"
                id="password-confirm"
                autoComplete="current-password"
                value={passwordConfirm}
                onChange={ e=>setPasswordConfirm(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="Prénom"
                autoFocus
                value={firstname}
                onChange={ (e ) => setFirstName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="lname"
                name="lastName"
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Nom"
                autoFocus
                value={lastname}
                onChange={ (e ) => setLastName(e.target.value)}
              />
            </Grid>

          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            S'inscrire
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/login" variant="body2">
                Déjà inscrit(e) ? S’identifier
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Signup;