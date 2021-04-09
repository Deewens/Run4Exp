import * as React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia, CircularProgress,
  Container,
  Fab,
  Grid, Skeleton,
  Theme,
  Typography,
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles"
import AddIcon from '@material-ui/icons/Add'
import {useState} from "react"
import {Link} from "react-router-dom"
import CreateChallengeDialog from "./CreateChallengeDialog"
import useChallenges from "../../../../api/useChallenges"
import {useRouter} from "../../../../hooks/useRouter"
import NoImageFoundImage from "../../../../images/no-image-found-image.png"
import ChallengeCard from "./ChallengeCard";

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
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      bottom: theme.spacing(9),
    }
  },
  loading: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const ChallengeList = () => {
  const classes = useStyles();

  const [openDialogCreate, setOpenDialogCreate] = useState(false);
  const queryChallenges = useChallenges()

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Grid container spacing={2} justifyContent="center">
          {
            queryChallenges.isLoading && (
              <div className={classes.loading}>
                <CircularProgress size="large" />
              </div>
            )
          }
          {queryChallenges.isSuccess &&
            (queryChallenges.data.page.totalElements === 0
            ? <p>Il n'y a aucun challenge à afficher.</p>
            : queryChallenges.data.data.map(challenge => {
                return (
                <Grid key={challenge.id} item>
                  <ChallengeCard challenge={challenge} />
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
}

export default ChallengeList