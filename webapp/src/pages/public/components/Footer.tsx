import {Theme, Grid, Container, Box, Typography } from '@material-ui/core';
import * as React from 'react';
import { Avatar, fullname, username, LoremIpsum } from "react-lorem-ipsum";
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) => ({
    root: {
      color: theme.palette.common.white,
    },
    body: {
      backgroundColor: '#181818'
    },
    bottom: {
      backgroundColor: '#0c0c0c',
    }
  })
);

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.root}>
      <div className={classes.body}>
        <Container maxWidth="lg">
          <Grid container>
            <Grid item md={4}>
              <div className="user">
                <Avatar gender="female" />
                <div className="full-name">{fullname('female')}</div>
                <div className="username">{`@${username()}`}</div>
              </div>
            </Grid>

            <Grid item md={4}>
              <LoremIpsum />
            </Grid>

            <Grid item md={4}>
              <LoremIpsum />
            </Grid>
          </Grid>
        </Container>
      </div>
      <div>
        <Box className={classes.bottom} display="flex" justifyContent="space-between" px={50} py={1}>
          <Typography variant="body2">© Copyright {new Date().getFullYear()} Acrobatt</Typography>
          <Typography>Designed by Adrien Dudon</Typography>
        </Box>
      </div>
    </footer>
  )
}

export default Footer;