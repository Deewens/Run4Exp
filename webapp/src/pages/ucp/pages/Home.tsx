import {Button, Card, CardContent, Grid, Theme, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Image from '../../../images/background_parallax.jpg'
import {useAuth} from "../../../hooks/useAuth";
import CardStats from "../components/CardStats/CardStats";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(4)
  },
  card: {
    background: `url(${Image})`,
  }
}))

export default function Home() {
  const classes = useStyles()
  const {user} = useAuth()
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography gutterBottom variant="h2">
                Bon retour {user?.firstName}
              </Typography>
              <Typography gutterBottom variant="body1" color="textSecondary" component="p">
                Retrouvez l'historique de vos courses, les statistiques et toutes les informations sur les mises à jours
                de
                votre application !
              </Typography>
              <Button variant="contained">
                Voir les mises à jours
              </Button>
            </CardContent>
          </Card>
        </Grid>
        {/*<CardStats/>*/}
      </Grid>
    </div>
  )
}