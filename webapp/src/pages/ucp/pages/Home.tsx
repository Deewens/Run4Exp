import {Box, Button, Card, CardContent, Grid, Paper, Skeleton, Theme, Typography} from "@material-ui/core";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import {useAuth} from "../../../hooks/useAuth";
import StatsCard from "../components/StatsCard";
import {NavLink} from "react-router-dom";
import useStatistics from "../../../api/statistics/useStatistics";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Bar,
  BarChart,
  Tooltip
} from 'recharts'
import {useEffect, useState} from "react";
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(4)
  },
  newsSection: {
    paddingBottom: theme.spacing(2),
  },
}))

type SimpleChartType = {
  label: string
  value: number
}

export default function Home() {
  const classes = useStyles()
  const {user} = useAuth()

  const theme = useTheme()

  const [barChartData, setBarChartData] = useState<SimpleChartType[]>([
    {label: 'En cours', value: 0,},
    {label: 'Terminés', value: 0,},
  ])

  const [dailyDistanceChartData, setDailyDistanceChartData] = useState<SimpleChartType[]>([])

  const statistics = useStatistics()
  useEffect(() => {
    if (statistics.isSuccess) {
      setBarChartData([
        {label: 'En cours', value: statistics.data.ongoingChallenges,},
        {label: 'Terminés', value: statistics.data.finishedChallenges,},
      ])
      let dailyDistanceData: SimpleChartType[] = []
      statistics.data.dailyDistance.forEach(data => {
        dailyDistanceData.push({label: data.day.toLocaleDateString(), value: data.distance})
      })

      setDailyDistanceChartData(dailyDistanceData)
      console.log(statistics.data.totalTime)
    }
  }, [statistics.isSuccess])


  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={6}>
          <Card elevation={4}>
            <CardContent>
              <Typography gutterBottom variant="h2">
                Bon retour {user?.firstName}
              </Typography>
              <Typography gutterBottom variant="body1" color="textSecondary" component="p">
                Retrouvez l'historique de vos courses, les statistiques et toutes les informations sur les mises à jour
                de
                votre application !
              </Typography>
              <Button variant="contained" component={NavLink} to="/ucp/changelogs">
                Voir les mises à jours
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Paper
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              padding: theme => theme.spacing(4)
            }}
            elevation={4}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} layout="vertical">
                <Bar dataKey="value" fill={theme.palette.primary.main} />
                <XAxis type="number" interval={3} />
                <YAxis type="category" dataKey="label" width={65} />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
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
        pb={3}
      >
        {statistics.isLoading && (
          [4].forEach(() => (
            <Skeleton variant="rectangular" height={115} />
          ))
        )}

        {statistics.isSuccess && (
          <>
            <StatsCard
              icon={<DirectionsRunIcon htmlColor="#fff" fontSize="large" />}
              title="Distance parcourue"
              value={"" + (statistics.data.totalDistance / 1000).toFixed(2) + "km"}
              color="#1C6EA4"
            />
            <StatsCard
              icon={<AccessTimeIcon htmlColor="#fff" fontSize="large" />}
              title="Temps passé"
              value={"" + new Date(statistics.data.totalTime * 1000).toISOString().substr(11, 8) + "h"}
              color="gray"
            />
            <StatsCard
              icon={<PlayCircleOutlineIcon htmlColor="#fff" fontSize="large" />}
              title="Challenges en cours"
              value={"" + statistics.data.ongoingChallenges}
              color="green"
            />
            <StatsCard
              icon={<CheckCircleOutlineIcon htmlColor="#fff" fontSize="large" />}
              title="Challenges terminés"
              value={"" + statistics.data.finishedChallenges}
              color="pink"
            />
          </>
        )}
      </Box>
      <Paper sx={{width: '100%', height: '450px', p: theme => theme.spacing(2)}} elevation={4}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyDistanceChartData}>
            <Line type="monotone" dataKey="value" stroke={theme.palette.primary.main} />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </div>
  )
}