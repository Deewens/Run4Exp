import {Box, Button, Card, CardContent, Grid, Theme, Typography} from "@material-ui/core";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import Image from '../../../images/background_parallax.jpg'
import {useAuth} from "../../../hooks/useAuth";
import StatsCard from "../components/CardStats/StatsCard";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(4)
  },
  newsSection: {
    paddingBottom: theme.spacing(2),
  },
  challengesNewsCard: {}
}))

export default function Home() {
  const classes = useStyles()
  const {user} = useAuth()

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item sm={12} md={6}>
          <Card>
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
      </Grid>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          columnGap: '10px',
          rowGap: '10px',
          justifyContent: 'space-around',
        }}
        pt={5}
      >
        <StatsCard
          title="Km parcourus"
          value="478 km"
          color="#1C6EA4"
        />
        <StatsCard
          title="Temps passé"
          value="345 h"
          color="gray"
        />
        <StatsCard
          title="Challenges lancés"
          value="37"
          color="green"
        />
        <StatsCard
          title="Challenges terminés"
          value="5"
          color="pink"
        />
      </Box>
    </div>
  )
}