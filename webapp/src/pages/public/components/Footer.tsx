import {Theme, Grid, Container, Box, Typography, Avatar, Toolbar, IconButton} from '@material-ui/core';
import * as React from 'react';
import {fullname, username, LoremIpsum} from "react-lorem-ipsum";
import {makeStyles} from "@material-ui/core/styles"
import Moi from '../../../images/moi.jpg'
import Logo from "../../../images/acrobbatt-icon-green-1.png";
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import GitHubIcon from '@material-ui/icons/GitHub';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
      color: theme.palette.common.white,
    },
    body: {
      backgroundColor: '#181818',
    },
    bottom: {
      backgroundColor: '#0c0c0c',
    }
  })
);

/**
 * Landing page footer
 */
const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.root}>
      <div className={classes.body}>
        <Container maxWidth="lg" sx={{p: 5,}}>
          <Grid container spacing={5} sx={{alignItems: 'center', justifyContent: 'center',}}>
            <Grid item sm={12} md={4} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
              <img src={Logo} alt="Logo" style={{height: 'auto', width: '100%', maxWidth: 75,}} />
              <Typography variant="h4" align="center" sx={{display: 'flex', alignItems: 'center', fontWeight: 'bold',}}>
                Run4Exp
              </Typography>
            </Grid>

            <Grid item sm={12} md={4}
                  sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',}}>
              <Typography variant="subtitle1" align="left">Liens rapides</Typography>
              <Typography variant="body2" align="left"><NavLink to="/signin">Connexion</NavLink></Typography>
              <Typography variant="body2"><NavLink to="/signup">Inscription</NavLink></Typography>
              <Typography variant="body2"><NavLink to="/ucp">Tableau de bord</NavLink></Typography>
              <Typography variant="body2"><NavLink to="/ucp/my-challenges">Voir mes challenges</NavLink></Typography>
            </Grid>

            <Grid item sm={12} md={4}
                  sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',}}>
              <Typography variant="subtitle1">Suivez Run4Exp sur les réseaux sociaux</Typography>
              <Box sx={{display: 'flex', flexDirection: 'row',}}>
                <IconButton>
                  <FacebookIcon sx={{fontSize: 40, color: '#fff', '&:hover': {color: '#1092F4',}}} />
                </IconButton>
                <IconButton>
                  <TwitterIcon sx={{fontSize: 40, color: '#fff', '&:hover': {color: '#1DA1F2',}}} />
                </IconButton>
                <IconButton>
                  <InstagramIcon sx={{fontSize: 40, color: '#fff', '&:hover': {color: '#F7A54D',}}} />
                </IconButton>
                <IconButton>
                  <GitHubIcon sx={{fontSize: 40, color: '#fff', '&:hover': {color: '#fff',}}} />
                </IconButton>
              </Box>
            </Grid>

          </Grid>
        </Container>
      </div>
      <div>
        <Grid container className={classes.bottom} py={1} sx={{justifyContent: 'center', alignItems: 'center',}}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" align="center">© Copyright {new Date().getFullYear()} Acrobatt</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" align="center">Designed by Adrien Dudon</Typography>
          </Grid>
        </Grid>
      </div>
    </footer>
  )
}

export default Footer;