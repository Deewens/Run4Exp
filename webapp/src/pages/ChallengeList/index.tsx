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
import {useState} from "react";
import { Link } from "react-router-dom";

const challengeList: Challenge[] = [
  {
    name: "Bordelciel",
    description: "",
    scale: 0,
    segments: [],
    checkpoints: []
  },
  {
    name: "Roarjaltj",
    description: "",
    scale: 0,
    segments: [],
    checkpoints: []
  },
  {
    name: "jfremzljr ara",
    description: "",
    scale: 0,
    segments: [],
    checkpoints: []
  },
  {
    name: "Yoyoyo",
    description: "",
    scale: 0,
    segments: [],
    checkpoints: []
  }
]

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

  const [scrollTarget, setScrollTarget] = useState();
  //const scrollTrigger = useScrollTrigger();

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Grid container spacing={5} justifyContent="center">
          {
            challengeList.map((challenge, i) => {
              return (
                <Grid item md={5} xs={12} key={i}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.media}
                      image={SkyrimMap}
                      title={challenge.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {challenge.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        <LoremIpsum avgSentencesPerParagraph="3"/>
                      </Typography>
                    </CardContent>
                    <CardActions className={classes.actions}>
                      <Button size="small">Editer</Button>
                    </CardActions>
                  </Card>
                </Grid>
              )
            })
          }
        </Grid>
      </Container>
      <Link to="/draw">
        <Fab color="primary" aria-label="Ajouter" className={classes.fab} onClick={}>
          <AddIcon />
        </Fab>
      </Link>
    </div>
  );
};

export default ChallengeList;