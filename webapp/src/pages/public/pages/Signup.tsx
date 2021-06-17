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
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useSnackbar} from "notistack";
import LoadingButton from '@material-ui/lab/LoadingButton';
import {Alert, CircularProgress} from "@material-ui/core";
import {useAuth} from "../../../hooks/useAuth";
import Copyright from "../components/Copyright";
import {useRouter} from "../../../hooks/useRouter";
import {AxiosError} from "axios";
import {ErrorApi} from "../../../api/type";
import Background from '../../../images/wallpaper_oblivion.jpg';

const Signup = () => {
  const {signup, signin} = useAuth()
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
  const [isLoading, setIsLoading] = useState(false)

  const [firstname, setFirstname] = useState('');
  const [firstnameError, setFirstnameError] = useState(false)
  const [firstnameHelper, setFirstnameHelper] = useState('')

  const [lastname, setLastname] = useState('');
  const [lastnameError, setLastnameError] = useState(false)
  const [lastnameHelper, setLastnameHelper] = useState('')

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false)
  const [emailHelper, setEmailHelper] = useState('')

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false)
  const [passwordHelper, setPasswordHelper] = useState('')

  const [passwordConfirm, setPasswordConfirm] = useState('');

  const router = useRouter()

  let handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)

    setPasswordError(false)
    setPasswordHelper('')

    if (password !== passwordConfirm) {
      setPasswordError(true)
      setPasswordHelper("Les mots de passes ne correspondent pas.")
      setIsLoading(false)
      return;
    }

    signup(lastname, firstname, email, password, passwordConfirm)
    .then(data => {
      setIsLoading(false)
      enqueueSnackbar("Inscription réussie !", {
        variant: 'success'
      })

      signin(email, password)
      .then(data => {
        router.push('/ucp')
      })
      .catch((error: AxiosError<ErrorApi>) => {
        enqueueSnackbar("Une erreur est survenue lors de la connexion automatique.", {
          variant: 'error'
        })
        router.push('/signin')
      })
    })
    .catch((error: AxiosError) => {
      setIsLoading(false)
      enqueueSnackbar("Quelque chose s'est mal passé, vérifiez les informations.", {
        variant: 'error'
      })

      if (error.response?.data.errors) {
        error.response?.data.errors.forEach((error: ErrorApi) => {
          let err = error.error

          if (err === "At least one number, one lower case letter, one upper case letter and 8 characters") {
            setPasswordError(true)
            setPasswordHelper("Votre mot de passe doit contenir au moins 8 caractères avec un nombre, une lettre minuscule et une lettre majuscule.")
          }
        })
      }

      if (error.response?.data.message) {
        let err = error.response?.data.message
        if (err === "Le email existe déjà") {
          setEmailError(true)
          setEmailHelper("Cette adresse email est déjà prise")
        }
      }
    })
  }

  return (
    <Box>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            S'inscrire
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  error={emailError}
                  helperText={emailHelper}
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
                  error={passwordError}
                  helperText={passwordHelper}
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Mot de passe"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
                  onChange={e => setPasswordConfirm(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  error={firstnameError}
                  helperText={firstnameHelper}
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

              <Grid item xs={12} sm={6}>
                <TextField
                  error={lastnameError}
                  helperText={lastnameHelper}
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
            <LoadingButton
              loading={isLoading}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              S'inscrire
            </LoadingButton>
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
    </Box>
  );
};

export default Signup;