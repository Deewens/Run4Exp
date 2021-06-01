import * as React from 'react'
import {Box, CircularProgress, Grid, Typography} from "@material-ui/core";
import PublishedChallengeCard from "../components/PublishedChallengeCard";
import {Challenge} from "../../../api/entities/Challenge";
import useChallenges from "../../../api/useChallenges";

/**
 * Page permettant à un utilisateur de rechercher des challenges publiés pour lesquels il souhaite participer
 */
export default function FindChallenge() {
  const challenges = useChallenges()

  let content = <p>test</p>
  if (challenges.isSuccess) {
    let foundChallenges = false
    if (challenges.data.page.totalElements > 0) {
      content = (
        <Grid container spacing={2}>
          {
            challenges.data.data.map(challenge => {
              if (challenge.attributes.published) {
                foundChallenges = true
                return (
                  <Grid key={challenge.id!} item xs={12}>
                    <PublishedChallengeCard challenge={challenge}/>
                  </Grid>
                )
              }
            })
          }
        </Grid>
      )
    }

    if (!foundChallenges) {
      content = (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          Il n'y a aucun élément à afficher
        </Box>
      )
    }
  } else if (challenges.isLoading) {
    content = (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress size="large"/>
      </Box>
    )
  } else if (challenges.isError) {
    content = (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography color="red" variant="h3">
          Une erreur est survenue
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        margin: theme => theme.spacing(4)
      }}
    >
      {content}
    </Box>
  )
}