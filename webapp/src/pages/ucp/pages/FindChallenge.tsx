import * as React from 'react'
import {Box, CircularProgress, Grid, Typography} from "@material-ui/core";
import PublishedChallengeCard from "../components/PublishedChallengeCard";
import {Challenge} from "../../../api/entities/Challenge";
import useChallenges from "../../../api/useChallenges";
import useChallengesInfinite from "../../../api/useChallengesInfinite";

/**
 * Page permettant à un utilisateur de rechercher des challenges publiés pour lesquels il souhaite participer
 */
export default function FindChallenge() {
  const challenges = useChallengesInfinite({publishedOnly: true,})

  return (
    <Box
      sx={{
        margin: theme => theme.spacing(4)
      }}
    >
      {challenges.isLoading ? (
        <CircularProgress size="large"/>
      ) : challenges.isError ? (
        <p>Il y a eu une erreur...</p>
      ) : (
        <>
          {challenges.data?.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.data.map(challenge => (
                <Grid key={challenge.id!} item xs={12}>
                  <PublishedChallengeCard challenge={challenge}/>
                </Grid>
              ))}
            </React.Fragment>
          ))}
        </>
      )}
    </Box>
  )
}