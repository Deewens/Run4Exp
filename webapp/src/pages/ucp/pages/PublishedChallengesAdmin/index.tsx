import * as React from 'react'
import useChallenges from "../../../../api/useChallenges";

import {
  Box, Button,
  Paper,
  Table, TableBody, TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import {NavLink} from "react-router-dom";
import {useUserSessions} from "../../../../api/useUserSessions";
import {Challenge} from "../../../../api/entities/Challenge";

export default function PublishedChallengesAdmin() {
  const challenges = useChallenges()

  return (
    <Box
      sx={{
        margin: theme => theme.spacing(4)
      }}
    >
      <TableContainer component={Paper}>
        <Table aria-label="published-challenges table">
          <TableHead>
            <TableRow>
              <TableCell>Nom du challenge</TableCell>
              <TableCell>Nombre de participation</TableCell>
              <TableCell>Nombre de fois complétés</TableCell>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              challenges.isSuccess && challenges.data.data.map((challenge) => {
                let attributes = challenge.attributes
                if (attributes.published) {
                  return <Row key={challenge.id} challenge={challenge} />
                }
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

type RowProps = {
  challenge: Challenge
}

function Row(props: RowProps) {
  const {
    challenge,
  } = props

  const sessions = useUserSessions(challenge.id!)

  return (
    <TableRow>
      <TableCell>{challenge.attributes.name}</TableCell>
      <TableCell>{sessions.isSuccess ? sessions.data.length : "Chargement..."}</TableCell>
      <TableCell>TODO: faire la fonction</TableCell>
      <TableCell><Button component={NavLink} to={`/ucp/admin-published-challenges/${challenge.id}`}>Gestion</Button></TableCell>
    </TableRow>
  )
}