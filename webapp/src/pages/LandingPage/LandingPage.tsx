import { Theme } from '@material-ui/core';
import {TextField, Typography } from '@material-ui/core';
import { createStyles } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { Container } from '@material-ui/core';
import * as React from 'react';
import Parallax from "../../components/Parallax";
import ParallaxImage from '../../images/background_parallax.jpg';
import {CarouselSection} from "./sections/CarouselSection";
import CardsSection from "./sections/CardsSection";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    parallaxContent: {
      color: theme.palette.common.black,
    },
    parallaxTitle: {
      padding: theme.spacing(1),
      width: 700,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      boxShadow: '0px 5px 5px rgba(48, 48, 48, 0.5)',
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

const LandingPage = () => {
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
            <Typography variant="h3" component="h1">
              A la recherche d'un challenge ?
            </Typography>
            <Typography variant="body1">
              Vous souhaitez faire du sport de façon original ? Cherchez un thème pour trouver la zone virtuelle qui vous intéresse !
            </Typography>
          </div>
          <form noValidate autoComplete="off">
            <TextField
              id="search-challenge"
              defaultValue="Le seigneur des anneaux"
              className={classes.parallaxTextField}
              type="text"
            />
          </form>
        </Box>
      </Parallax>
      <CardsSection />
      <CarouselSection />
      <Container maxWidth="md">
      </Container>
    </div>
  )
}

export default LandingPage;