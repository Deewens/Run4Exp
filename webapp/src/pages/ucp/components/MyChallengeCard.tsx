import {Box, Button, Card, CardActions, CardContent, CardMedia, Skeleton, Theme, Typography} from "@material-ui/core";
import {Link, NavLink} from "react-router-dom";
import * as React from "react";
import {makeStyles} from "@material-ui/core/styles";
import NoImageFoundImage from "../../../images/no-image-found-image.png";
import LoremIpsum from "react-lorem-ipsum";
import {Challenge} from "../../../api/entities/Challenge";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  }
}))

type Props = {
  challenge: Challenge
}

export default function MyChallengeCard(props: Props) {
  const {
    challenge
  } = props

  const classes = useStyles()

  // const image = useChallengeImage(1);
  // let imageNotFound = NoImageFoundImage

  return (
    <Card className={classes.root}>
      <CardMedia
        component="img"
        image={NoImageFoundImage}
        title="No Image Found"
        sx={{
          width: '35%',
          height: '100'
        }}
      />
      <Box className={classes.content}>
        <CardContent sx={{flex: '1 0 auto'}}>
          <Typography component="div" variant="h5">
            {challenge.attributes.name}
          </Typography>
          <Box sx={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
            <Box sx={{display: 'flex', flexDirection: 'column',}}>
              <Typography variant="h6">
                Complétion
              </Typography>
              <Typography variant="body1">
                53%
              </Typography>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column',}}>
              <Typography variant="h6">
                Km parcourus
              </Typography>
              <Typography variant="body1">
                250 km
              </Typography>
            </Box>
          </Box>
        </CardContent>
        <CardActions sx={{alignSelf: 'flex-end'}}>
          <Button component={NavLink} to={`/ucp/my-challenges/${challenge.id}`} variant="contained" color="primary">
            Voir mon avancement
          </Button>
        </CardActions>
      </Box>
    </Card>
  )
}