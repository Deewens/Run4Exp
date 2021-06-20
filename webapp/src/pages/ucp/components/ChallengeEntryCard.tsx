import {Button, Card, CardActions, CardContent, CardMedia, Skeleton, Theme, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import * as React from "react";
import {Challenge} from "../../../api/entities/Challenge";
import {makeStyles} from "@material-ui/core/styles";
import useChallengeImage from "../../../api/hooks/challenges/useChallengeImage";
import {useRouter} from "../../../hooks/useRouter";
import NoImageFoundImage from "../../../images/no-image-found-image.png";
import useChallenge from "../../../api/hooks/challenges/useChallenge";

const cardWidth = 345
const cardHeight = 359
const mediaHeight = 140

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: cardWidth,
    height: cardHeight,
  },
  media: {
    height: mediaHeight,
  },
  actions: {
    display: 'flex',
    marginTop: 'auto',
    justifyContent: 'flex-end'
  },
}))

type Props = {
  challengeId: number
  onRegisterClick: () => void
  onDetailsClick: () => void
}

export default function ChallengeEntryCard(props: Props) {
  const {
    challengeId,
    onRegisterClick,
    onDetailsClick
  } = props
  const classes = useStyles()

  const challenge = useChallenge(challengeId)
  const image = useChallengeImage(challengeId);
  let imageNotFound = NoImageFoundImage

  if (challenge.isLoading) {
    return <Skeleton variant="rectangular" height={cardHeight} width={cardWidth} animation="wave"/>
  }

  if (challenge.isSuccess) {
    return (
      <Card className={classes.card}>
        {
          image.isLoading
            ? <Skeleton variant="rectangular" height={mediaHeight} animation="wave" />
            : image.isSuccess
            ? <CardMedia
              className={classes.media}
              image={image.data ? image.data : imageNotFound}
              title={challenge.data.attributes.name}
            />
            : <CardMedia
              className={classes.media}
              image={imageNotFound}
              title={challenge.data.attributes.name}
            />
        }
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {challenge.data.attributes.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {challenge.data.attributes.shortDescription}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <Button size="small" onClick={onRegisterClick}>Inscription</Button>
          <Button size="small" onClick={onDetailsClick}>Détails</Button>
        </CardActions>
      </Card>
    )
  }

  return null
}