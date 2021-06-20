import {Box, Button, Card, CardActions, CardContent, CardMedia, Skeleton, Theme, Typography} from "@material-ui/core";
import {Link, NavLink} from "react-router-dom";
import * as React from "react";
import {makeStyles} from "@material-ui/core/styles";
import NoImageFoundImage from "../../../images/no-image-found-image.png";
import LoremIpsum from "react-lorem-ipsum";
import {Challenge} from "../../../api/entities/Challenge";
import useChallenge from "../../../api/hooks/challenges/useChallenge";
import {useUserSession} from "../../../api/hooks/user_sessions/useUserSession";

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
  challengeId: number,
  userSessionId: number,
}

export default function MyChallengeCard(props: Props) {
  const {
    challengeId,
    userSessionId,
  } = props

  const challenge = useChallenge(challengeId)
  const userSession = useUserSession(userSessionId)
  const classes = useStyles()

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
            {challenge.isSuccess ? challenge.data.attributes.name : "Chargement..."}
          </Typography>
          <Box sx={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
            <Box sx={{display: 'flex', flexDirection: 'column',}}>
              <Typography variant="h6">
                Complétion
              </Typography>
              <Typography variant="body1">
                {/*{userSession.isSuccess ? userSession.data.attributes.totalAdvancement + '%' : "Chargement..."}*/}
              </Typography>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column',}}>
              <Typography variant="h6">
                Km parcourus
              </Typography>
              <Typography variant="body1">
                {userSession.isSuccess ? '500 km' : "Chargement..."}
              </Typography>
            </Box>
          </Box>
        </CardContent>
        <CardActions sx={{alignSelf: 'flex-end'}}>
          <Button component={NavLink} to={`/ucp/my-challenges/${challengeId}?session=${userSessionId}`} variant="contained" color="primary">
            Voir mon avancement
          </Button>
        </CardActions>
      </Box>
    </Card>
  )
}