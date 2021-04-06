import {Card, CardActionArea, CardContent, CardMedia, Divider, Theme, Typography} from "@material-ui/core";
import Marker from '../../../../images/markers/marker-icon-2x-violet.png'
import {makeStyles} from "@material-ui/core/styles";
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    maxWidth: 300,
  },
  logo: {
    backgroundColor: theme.palette.background.darker,
    padding: theme.spacing(4),
    margin: theme.spacing(1),
    borderRadius: '50%',
  }
}))

export default function CardStats() {
  const classes = useStyles()
  return (
    <Card className={classes.root}>
        <div className={classes.logo}>
          <DirectionsWalkIcon />
        </div>
        <CardContent>
          <Typography variant="h5">
            Km parcourus
          </Typography>
          <Typography variant="body1">
            150 km
          </Typography>
          <Divider />
        </CardContent>
    </Card>
  )
}