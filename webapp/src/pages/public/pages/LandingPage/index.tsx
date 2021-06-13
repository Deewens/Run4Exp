import {Button, Theme} from '@material-ui/core';
import {TextField, Typography } from '@material-ui/core';
import { createStyles } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { Container } from '@material-ui/core';
import * as React from 'react';
import Parallax from "./Parallax";
import ParallaxImage from '../../../../images/background_parallax.jpg';
import {CarouselSection} from "./CarouselSection"
import CardsSection from "./CardsSection"
import Footer from "../../components/Footer"
import Header from "../../components/Header";
import Smartphone from '../../../../images/smartphone.png'

const useStyles = makeStyles((theme: Theme) => ({
    parallaxContent: {
      color: theme.palette.common.black,
    },
    parallaxTitle: {
      paddingLeft: theme.spacing(8),
      paddingRight: theme.spacing(8),
      padding: theme.spacing(3),
      width: 900,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(5px)',
      boxShadow: '0px 5px 5px rgba(48, 48, 48, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    parallaxTextField: {
      margin: theme.spacing(1),
      width: '50ch',
      backgroundColor: theme.palette.common.white,
      boxShadow: '0px 5px 5px rgba(48, 48, 48, 1)',
      border: '5px outset beige',
      borderRadius: '5px',
    },
  })
);

const Index = () => {
  const classes = useStyles();

  return (
    <div>
      <Parallax image={ParallaxImage}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          width="100%"
          className={classes.parallaxContent}
        >
          <div className={classes.parallaxTitle}>
            <Typography variant="h3" component="h1" sx={{fontWeight: 'bold',}}>
              A la recherche d'un challenge ?
            </Typography>
            <Typography variant="body1">
              Vous souhaitez faire du sport de façon original ? Cherchez un thème pour trouver la zone virtuelle qui vous intéresse !
            </Typography>

            <Button variant="contained" sx={{width: 250,}}>Télécharger l'application</Button>
            <Button sx={{width: 250,}}>Inscription</Button>

          </div>
        </Box>
      </Parallax>
      <CardsSection />
      <CarouselSection />
      <Container maxWidth="md">
      </Container>
      <Footer/>
    </div>
  )
}

export default Index;