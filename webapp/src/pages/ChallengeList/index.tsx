import * as React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Fab,
  Grid,
  Theme,
  Typography,
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import SkyrimMap from '../../images/maps/map_skyrim.jpg';
import {Challenge} from "@acrobatt";
import LoremIpsum from "react-lorem-ipsum";
import AddIcon from '@material-ui/icons/Add';
import {useEffect, useState} from "react";
import {Link, useRouteMatch} from "react-router-dom";
import CreateChallengeDialog from "./CreateChallengeDialog";
import {useQuery} from "react-query";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  card: {
    maxWidth: 345,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  media: {
    height: 140,
  },
  fab: {
    position: 'fixed',
    right: 20,
    bottom: 20,
  }
}));

const ChallengeList = () => {
  const classes = useStyles();

  const [openDialogCreate, setOpenDialogCreate] = useState(false);
  const [scrollTarget, setScrollTarget] = useState();
  //const scrollTrigger = useScrollTrigger();

  //const {isLoading, isError, error, data} = useQuery('getChallenges', Api.getChallenges);

  const match = useRouteMatch();

  return null

  // return (
  //   <div className={classes.root}>
  //     <Container maxWidth="md">
  //       <Grid container spacing={5} justifyContent="center">
  //         {isLoading
  //           ? <p>Chargement...</p>
  //           : isError
  //             ? <p>Une erreur s'est produite :(</p>
  //             : data._embedded.challengeResponseModelList.length
  //               ? (
  //                 data._embedded.challengeResponseModelList.map((challenge: Challenge) => {
  //                   return (
  //                     <Grid item md={5} xs={12} key={challenge.id}>
  //                       <Card className={classes.card}>
  //                         <CardMedia
  //                           className={classes.media}
  //                           image={SkyrimMap}
  //                           title={challenge.name}
  //                         />
  //                         <CardContent>
  //                           <Typography gutterBottom variant="h5" component="div">
  //                             {challenge.name}
  //                           </Typography>
  //                           <Typography variant="body2" color="textSecondary" component="p">
  //                             <LoremIpsum avgSentencesPerParagraph="3"/>
  //                           </Typography>
  //                         </CardContent>
  //                         <CardActions className={classes.actions}>
  //                           <Button size="small" component={Link} to={match.url + "/" + challenge.id}>Editer</Button>
  //                         </CardActions>
  //                       </Card>
  //                     </Grid>
  //                   )
  //                 })
  //               )
  //               : <p>Il n'y a aucun challenge affichable. Créer en un !!</p>
  //         }
  //       </Grid>
  //     </Container>
  //     <Fab color="primary" aria-label="Ajouter" className={classes.fab} onClick={() => setOpenDialogCreate(true)}>
  //       <AddIcon />
  //     </Fab>
  //     <CreateChallengeDialog open={openDialogCreate} setOpen={setOpenDialogCreate} />
  //   </div>
  // );
};

export default ChallengeList;