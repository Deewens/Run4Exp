import {Box, Container, createStyles, makeStyles, Theme, Typography} from '@material-ui/core';
import {Grid} from '@material-ui/core';
import * as React from 'react';
import Fallout4 from '../../../../images/fallout_4_travel.jpg';
import SmartphoneOnBike from '../../../../images/mockups/smartphone-on-bike.jpg'
import Example from '../../../../images/example.png'
import {LoremIpsum} from 'react-lorem-ipsum';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    card: {
      display: 'flex',
    },
    image: {
      objectFit: 'cover',
      objectPosition: '20% 30%',
      height: '300px',
      width: '100%',
    },
  })
);

const CardsSection = () => {
  const classes = useStyles();

  return (
    <Box p={2}>
      <Container maxWidth="lg">
        <Grid container spacing={5} justifyContent="center" alignItems="center">
          <Grid item md={6}>
            <img className={classes.image} src={Fallout4} alt="female sport" />
          </Grid>

          <Grid item md={6}>
            <Typography variant="h4">
              Préparez-vous à voyager !
            </Typography>
            <Typography variant="subtitle1">
              Même en courant prêt de chez vous, vous irez bien plus loin !
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={5} justifyContent="center" alignItems="center" flexDirection="row-reverse">
          <Grid item md={6}>
            <img className={classes.image} src={Example} alt="female sport" />
          </Grid>

          <Grid item md={6}>
            <Typography variant="h4">
              Créer vos propres aventures !
            </Typography>
            <Typography variant="subtitle1">
              Partez à l'aventure dans les plaines de Bordeciel !
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={5} justifyContent="center" alignItems="center">
          <Grid item md={6}>
            <img className={classes.image} src={SmartphoneOnBike} alt="female sport" />
          </Grid>

          <Grid item md={6}>
            <Typography variant="h4">
              Partez en vélo !
            </Typography>
            <Typography variant="subtitle1">
              Prenez votre vélo et allez vous balader dans les montagnes d'Oblivion
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default CardsSection;