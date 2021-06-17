import * as React from 'react'
import useChallenges from "../../../../api/challenges/useChallenges";

import {
  Box, Button,
  Paper,
  Table, TableBody, TableCell,
  TableContainer, TableFooter,
  TableHead,
  TableRow,
} from "@material-ui/core";
import {NavLink} from "react-router-dom";
import {useUserSessions} from "../../../../api/user_sessions/useUserSessions";
import {Challenge} from "../../../../api/entities/Challenge";
import TablePagination from "@material-ui/core/TablePagination";
import {useState} from "react";

export default function PublishedChallengesAdmin() {

  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [page, setPage] = useState(0)
  const challenges = useChallenges({page, publishedOnly: true, adminOnly: true,})

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
              <TableCell>Nombre de participations</TableCell>
              <TableCell>Nombre de fois complétées</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {challenges.isSuccess && (
              challenges.data.page.totalElements > 0 ? (
                challenges.data.data.map((challenge) => {
                  let attributes = challenge.attributes
                  if (attributes.published) {
                    return <Row key={challenge.id} challenge={challenge} />
                  }
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>Aucun de vos challenges n'a été publié pour le moment.</TableCell>
                </TableRow>
              )
            )}

            {challenges.isError && (
              <TableRow>
                <TableCell colSpan={4}>Erreur lors de la récupération des données..</TableCell>
              </TableRow>
            )}

            {challenges.isLoading && (
              <TableRow>
                <TableCell colSpan={4}>Chargement des données...</TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              {challenges.isSuccess && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 20]}
                  colSpan={4}
                  count={challenges.data.page.totalElements}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  onRowsPerPageChange={e => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0)
                  }}
                />
              )}
            </TableRow>
          </TableFooter>
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

  let nbCompleted = 0
  if (sessions.isSuccess) {
    sessions.data.forEach(session => {
      session.attributes.events.forEach(event => {
        if (event.type === 'END') {
          nbCompleted++
        }
      })
    })
  }

  return (
    <TableRow>
      <TableCell>{challenge.attributes.name}</TableCell>
      <TableCell>{sessions.isSuccess ? sessions.data.length : "Chargement..."}</TableCell>
      <TableCell>{nbCompleted}</TableCell>
      <TableCell><Button component={NavLink}
                         to={`/ucp/admin-published-challenges/${challenge.id}`}>Gestion</Button></TableCell>
    </TableRow>
  )
}