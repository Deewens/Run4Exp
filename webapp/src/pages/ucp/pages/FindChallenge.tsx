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

  return (
    <Box
      sx={{
        margin: theme => theme.spacing(4)
      }}
    >
      {
        challenges.isSuccess
          ? (
            <Grid container spacing={2}>
              {
                challenges.data.data.map(challenge => {
                  if (challenge.attributes.published) {
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
          : challenges.isLoading
          ? (
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
          : (
            <Box
              sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography color="red" variant="h1">
                Une erreur est survenue
              </Typography>
            </Box>
          )
      }
    </Box>
  )
}