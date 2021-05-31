import {Button, Card, CardActions, CardContent, CardMedia, Skeleton, Theme, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import * as React from "react";
import {Challenge} from "../../../../api/entities/Challenge";
import {makeStyles} from "@material-ui/core/styles";
import useChallengeImage from "../../../../api/useChallengeImage";
import {useRouter} from "../../../../hooks/useRouter";
import NoImageFoundImage from "../../../../images/no-image-found-image.png";

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
  challenge: Challenge
}

export default function ChallengeCard(props: Props) {
  const {
    challenge
  } = props
  const classes = useStyles()
  const router = useRouter()


  const image = useChallengeImage(challenge.id!);
  let imageNotFound = NoImageFoundImage

  return (
    <Card className={classes.card}>
      {
        image.isLoading
          ? <Skeleton variant="rectangular" height={mediaHeight} animation="wave"/>
          : image.isSuccess
          ? <CardMedia
            className={classes.media}
            image={image.data ? image.data : imageNotFound}
            title={challenge.attributes.name}
          />
          : <CardMedia
            className={classes.media}
            image={imageNotFound}
            title={challenge.attributes.name}
          />
      }
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {challenge.attributes.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {challenge.attributes.shortDescription}
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button size="small" component={Link} to={"/ucp/challenge-editor/" + challenge.id}>Editer</Button>
      </CardActions>
    </Card>
  )
}