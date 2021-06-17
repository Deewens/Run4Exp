import {Button, Theme} from '@material-ui/core';
import {TextField, Typography} from '@material-ui/core';
import {createStyles} from '@material-ui/core';
import {Box} from '@material-ui/core';
import {makeStyles} from '@material-ui/core';
import {Container} from '@material-ui/core';
import * as React from 'react';
import Parallax from "./Parallax";
import ParallaxImage from '../../../../images/wallpaper_oblivion.jpg';
import {CarouselSection} from "./CarouselSection"
import CardsSection from "./CardsSection"
import Footer from "../../components/Footer"
import Header from "../../components/Header";
import Smartphone from '../../../../images/smartphone.png'
import Clouds from '../../../../images/cloudsjpg.webp'

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
    scrollDown: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      width: 40,
      height: 40,
      transform: 'translateY(-80px) translateX(-50%) rotate(45deg)',
      '& span': {
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'block',
        width: '100%',
        height: '100%',
        borderBottom: '3px solid white',
        borderRight: '3px solid white',
        animation: '$animate 1.5s linear infinite',
        opacity: 0,
        '&:nth-child(1)': {
          transform: 'translate(-15px, -15px)',
          animationDelay: '-0.4s',
        },
        '&:nth-child(2)': {
          transform: 'translate(0, 0)',
          animationDelay: '-0.2s',
        },
        '&:nth-child(3)': {
          transform: 'translate(15px, 15px)',
          animationDelay: '0s',
        }
      }
    },
    '@keyframes animate': {
      '0%': {
        top: -5,
        left: -5,
        opacity: 0,
      },
      '25%': {
        top: 0,
        left: 0,
        opacity: 1,
      },
      '50%,100%': {
        top: 5,
        left: 5,
        opacity: 0,
      }
    }
  })
);

const Index = () => {
  const classes = useStyles();

  return (
    <Box>
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
              Vous souhaitez faire du sport de façon original ? Cherchez un thème pour trouver la zone virtuelle qui
              vous intéresse !
            </Typography>

            <Button variant="contained" sx={{width: 250,}}>Télécharger l'application</Button>
            <Button sx={{width: 250,}}>Inscription</Button>

          </div>
        </Box>
        {/* Scrolldown indicator */}
        <Box className={classes.scrollDown}>
          <span/>
          <span/>
          <span/>
        </Box>
      </Parallax>
      <CardsSection />
      <CarouselSection />
      <Container maxWidth="md">
      </Container>
      <Footer />
    </Box>
  )
}

export default Index;