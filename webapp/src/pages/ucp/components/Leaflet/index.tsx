import * as React from 'react';
import {Box, Container, Divider, Grid, Paper, Typography} from "@material-ui/core";
import Map from "./Map";
import {useEffect, useState} from "react";
import ImageUpload from "./ImageUpload";
import {makeStyles} from "@material-ui/core/styles";
import SideSheet from "./SideSheet";
import { useParams } from 'react-router-dom';
import {useQuery} from "react-query";

const useStyles = makeStyles({
  root: {
    width: '100%',
    margin: '0 auto',
  },
  imageUpload: {
    height: '90vh'
  },
})

const Leaflet = () => {
  //@ts-ignore
  let {id} = useParams();

  const classes = useStyles();

  const [image, setImage] = useState<string | null>(null);

  //const {isLoading, isError, error, data} = useQuery(['getChallengeImage', id], () => Api.getChallengeImage(id));

  /*useEffect(() => {
    if (data) {
      console.log(data)
      setImage(data)
    };
  }, [data])*/

  // if (isLoading) {
  //   return <p>Chargement de l'éditeur...</p>
  // }
  //
  // if (isError) {
  //   return <p>Une erreur inatendu s'est produite !</p>
  // }



  if (image) {
    return (
      <Box className={classes.root}>
        <Paper>
          <Box p={3}>
          <Map
            image={image}
          />
          </Box>
        </Paper>
        <SideSheet/>
      </Box>
    )

  } else {
    return (
      <Grid container className={classes.imageUpload}>
        <Grid item md={6}>
          <ImageUpload setImage={setImage}/>
        </Grid>
        <Divider />
        <Grid item md={6}>
          <Typography variant="h4">
            Liste des modèles
          </Typography>
        </Grid>
      </Grid>
      )
  }
}

export default Leaflet;