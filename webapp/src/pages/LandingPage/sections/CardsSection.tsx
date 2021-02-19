import {Box, Container, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import * as React from 'react';
import GtaVFemaleSport from '../../../images/gtav_female_sport.jpg';
import {LoremIpsum} from 'react-lorem-ipsum';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {

    },
    card: {
      display: 'flex',
    },
    image: {
      height: 'auto',
      width: '100%',
    },
  })
);

const CardsSection = () => {
  const classes = useStyles();

  return (
    <Box p={2}>
      <Container maxWidth="md">
        <Grid container spacing={10} justifyContent="center" alignItems="center">
          <Grid item md={6}>
            <img className={classes.image} src={GtaVFemaleSport} alt="female sport" />
          </Grid>

          <Grid item md={6}>
            <Typography variant="h6">
              Des courses virtuelles
            </Typography>
            <LoremIpsum />
          </Grid>
        </Grid>

        <Grid container spacing={10} justifyContent="center" alignItems="center">
          <Grid item md={6}>
            <Typography variant="h6">
              Des courses virtuelles
            </Typography>
            <LoremIpsum />
          </Grid>

          <Grid item md={6}>
            <img className={classes.image} src={GtaVFemaleSport} alt="female sport" />
          </Grid>
        </Grid>

        <Grid container spacing={10} justifyContent="center" alignItems="center">
          <Grid item md={6}>
            <img className={classes.image} src={GtaVFemaleSport} alt="female sport" />
          </Grid>

          <Grid item md={6}>
            <Typography variant="h6">
              Des courses virtuelles
            </Typography>
            <LoremIpsum />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default CardsSection;