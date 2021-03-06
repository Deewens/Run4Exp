import * as React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia, CircularProgress,
  Container,
  Fab,
  Grid,
  Theme,
  Typography,
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import SkyrimMap from '../../images/maps/map_skyrim.jpg';
import AddIcon from '@material-ui/icons/Add';
import {useEffect, useState} from "react";
import {Link, useRouteMatch} from "react-router-dom";
import CreateChallengeDialog from "./CreateChallengeDialog";
import useChallenges from "../../api/useChallenges";
import {useRouter} from "../../hooks/useRouter";
import useChallengeImage from "../../api/useChallengeImage";
import NoImageFoundImage from "../../images/no-image-found-image.png"
import {useQueryClient} from "react-query";

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

  const queryChallenges = useChallenges()

  const router = useRouter();

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Grid container spacing={5} justifyContent="center">
          {queryChallenges.isLoading && <p>Loading...</p>}
          {queryChallenges.isSuccess &&
            (queryChallenges.data.page.totalElements === 0
            ? <p>Il n'y a aucun challenge à afficher.</p>
            : queryChallenges.data._embedded.challengeResponseModelList.map(challenge => {

                let img = NoImageFoundImage

                return (
                <Grid item md={5} xs={12} key={challenge.id}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.media}
                      image={img}
                      title={challenge.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {challenge.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {challenge.description}
                      </Typography>
                    </CardContent>
                    <CardActions className={classes.actions}>
                      <Button size="small" component={Link} to={"/challenge-editor/" + challenge.id}>Editer</Button>
                    </CardActions>
                  </Card>
                </Grid>
              )
            }))
          }
          {queryChallenges.isError && <p>Il y a eu une erreur...</p>}
        </Grid>
      </Container>
      <Fab color="primary" aria-label="Ajouter" className={classes.fab} onClick={() => setOpenDialogCreate(true)}>
        <AddIcon />
      </Fab>
      <CreateChallengeDialog open={openDialogCreate} setOpen={setOpenDialogCreate} />
    </div>
  );
};

export default ChallengeList;