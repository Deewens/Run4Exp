import {
  Box, Button,
  Card, CardActionArea, CardActions,
  CardContent,
  CardHeader,
  CardMedia, Collapse, Grid,
  IconButton,
  IconButtonProps,
  Theme,
  Typography
} from "@material-ui/core";
import {experimentalStyled as styled} from "@material-ui/core";
import * as React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Challenge} from "../../../api/entities/Challenge";
import {useState} from "react";
import NoImageFoundImage from "../../../images/no-image-found-image.png";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import useChallengeImage from "../../../api/useChallengeImage";
import useCreateUserSession from "../../../api/useCreateUserSession";
import {useQueryClient} from "react-query";

type Props = {
  challenge: Challenge
}

export default function PublishedChallengeCard(props: Props) {
  const {
    challenge
  } = props


  const image = useChallengeImage(challenge.id!)
  const createSession = useCreateUserSession()
  const [expanded, setExpanded] = useState(false)

  const queryClient = useQueryClient()

  const handleExpandClick = () => {
    setExpanded(prevState => !prevState)
  }

  const handleSubscribeClick = () => {
    createSession.mutate({challengeId: challenge.id!}, {
      onError(error) {
        console.log(error.response)
      },
      onSuccess(success) {
        queryClient.invalidateQueries(['userSessions', challenge.id!])
      }
    })
  }

  return (
    <Card>
      <CardActionArea>
        <Grid container>
          <Grid item sm={12} md={4}>
            <CardMedia
              component="img"
              image={image.isSuccess && image.data ? image.data : NoImageFoundImage}
              title="Skyrim"
              sx={{
                height: 250,
              }}
            />
          </Grid>
          <Grid item sm={12} md={8}>
            <CardContent sx={{display: 'flex', flexDirection: 'column'}}>
              <Typography component="div" variant="h5">
                {challenge.attributes.name}
              </Typography>
              <Typography component="div" variant="subtitle1" color="text.secondary">
                {challenge.attributes.shortDescription}
              </Typography>
            </CardContent>
            <Box sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end',}}>
              <CardActions>
                <Button variant="contained" color="primary" onClick={handleSubscribeClick}>
                  S'inscrire
                </Button>
                <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="voir plus"
                >
                  <ExpandMoreIcon/>
                </ExpandMore>
              </CardActions>
            </Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <div dangerouslySetInnerHTML={{
                  __html: challenge.attributes.description
                }}>
                </div>
              </CardContent>
            </Collapse>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  )
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const {expand, ...other} = props
  return <IconButton {...other} />
})(({theme, expand}) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))