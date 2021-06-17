import {Divider, Theme} from '@material-ui/core';
import {Typography} from '@material-ui/core';
import {Box} from '@material-ui/core';
import {makeStyles} from '@material-ui/core';
import * as React from 'react';
import Parallax from "./Parallax";
import ParallaxImage from '../../../../images/wallpaper_oblivion.jpg';
import {CarouselSection} from "./CarouselSection"
import CardsSection from "./CardsSection"
import Footer from "../../components/Footer"
import GetAppIcon from '@material-ui/icons/GetApp';
import FeaturesSection from "./FeaturesSection";
import TestimonialsSection from "./TestimonialsSection";

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
    },
    downloadAppBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "45%",
      maxWidth: "170px",
      color: "#fff",
      margin: "20px 10px",
      textAlign: "left",
      borderRadius: "5px",
      textDecoration: "none",
      fontFamily: '"Lucida Grande", sans-serif',
      fontSize: "10px",
      textTransform: "uppercase",
      backgroundColor: "#101010",
      transition: "background-color 0.25s linear",
      '&:hover': {
        backgroundColor: "#454545",
      }
    },
    downloadAppBtnIcon: {
      width: "20%",
      textAlign: "center",
      marginRight: "7px"
    },
    downloadAppBtnTxt: {
      fontSize: "17px",
      textTransform: "capitalize"
    }
  })
);

const Index = () => {
  const classes = useStyles();

  return (
    <Box>
      <Parallax image={ParallaxImage}>
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '20%'
          }}
        >
          <Typography variant="h3" component="h1" sx={{fontWeight: 'bold', color: '#fff',}}>
            A la recherche d'un challenge ?
          </Typography>
          <Typography variant="h5" sx={{color: '#fff'}}>
            Téléchargez l'application Run4Exp sur Android !
          </Typography>
          <a className={classes.downloadAppBtn} href="/acrobatt.apk">
            <GetAppIcon className={classes.downloadAppBtnIcon} />
            <p>Télécharger sur <br /> <span className={classes.downloadAppBtnTxt}>Android</span></p>
          </a>
        </Box>





        {/* Scrolldown indicator */}
        <Box className={classes.scrollDown}>
          <span />
          <span />
          <span />
        </Box>
      </Parallax>
      <CardsSection />
      <CarouselSection />
      <FeaturesSection />
      <Divider />
      <TestimonialsSection />
      <Footer />
    </Box>
  )
}

export default Index;