import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider, Grid, IconButton,
  Paper,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography
} from "@material-ui/core";
import {User} from "../../../../api/type";
import * as React from "react";
import useUserSessionRuns from "../../../../api/user_sessions/useUserSessionRuns";
import CloseIcon from '@material-ui/icons/Close';
import {useUserSession} from "../../../../api/user_sessions/useUserSession";
import {useSegment} from "../../../../api/segments/useSegment";
import useObstacle from "../../../../api/obstacles/useObstacle";
import useChallenge from "../../../../api/challenges/useChallenge";
import {useCheckpoints} from "../../../../api/checkpoints/useCheckpoints";
import {useEffect, useState} from "react";
import {EventSession} from "../../../../api/entities/UserSession";

interface Props {
  open: boolean
  onClose: () => void
  user: User
  sessionId: number
  challengeId: number
}

export default function PlayerDetailsDialog(props: Props) {
  const {
    open,
    onClose,
    user,
    sessionId,
    challengeId,
  } = props

  const challenge = useChallenge(challengeId)
  const session = useUserSession(sessionId)

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <DialogTitle>
          Détails et historique
        </DialogTitle>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <DialogContent>
        {session.isLoading && (
          <Typography>Chargement des données...</Typography>
        )}

        {session.isSuccess && challenge.isSuccess && (
          <>
            <Typography variant="h5">
              Données actuelles
            </Typography>
            <Typography variant="body1" gutterBottom>
              Progression actuelle
            </Typography>
            <Paper sx={{my: 2, p: 2,}}>
              <Grid container component="dl" spacing={2} sx={{alignItems: 'center',}}>
                <Grid item xs={12} md={4}>
                  <Typography component="dt" variant="h6">
                    Etat
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography component="dd" variant="body2">
                    {session.data.attributes.events.find(event => event.type === "END") ? "Challenge terminé" : "Challenge en cours"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography component="dt" variant="h6">
                    Distance parcourue (en m)
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography component="dd" variant="body2">
                    {session.data.attributes.advancement}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </>
        )}

        <Typography variant="h5">
          Historique
        </Typography>
        <Typography variant="body1">
          Tableau affichant l'historique des actions du joueur
        </Typography>
        <TableContainer component={Paper} sx={{maxHeight: 500,}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date de l'évènement</TableCell>
                <TableCell>Évènement</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {session.isSuccess && (
                session.data.attributes.events.length > 0 ? (
                  session.data.attributes.events.map((event, index) => {

                    if (event.type === 'BEGIN_RUN') {
                      return (
                        <HistoryRow key={index} date={event.date}>
                          Début de la session de course
                        </HistoryRow>
                      )
                    } else if (event.type === 'ADVANCE') {
                      return (
                        <HistoryRow key={index} date={event.date}>
                          Avancé de {parseInt(event.value)}m
                        </HistoryRow>
                      )
                    } else if (event.type === 'CHANGE_SEGMENT') {
                      return (
                        <SegmentHistoryRow key={index} event={event} />
                      )
                    } else if (event.type === 'END_RUN') {
                      return (
                        <HistoryRow key={index} date={event.date}>
                          Fin de la session de course
                        </HistoryRow>
                      )
                    } else if (event.type === 'PASS_OBSTACLE') {
                      return <ObstacleHistoryRow key={index} event={event} />
                    } else if (event.type === 'END') {
                      return (
                        <HistoryRow key={index} date={event.date}>
                          Challenge terminé, félicitations !
                        </HistoryRow>
                      )
                    }

                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={2}>Aucun historique n'est disponible</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  )
}

type HistoryRowProps = {
  date: Date
  children: React.ReactNode
}

function HistoryRow(props: HistoryRowProps) {
  const {
    date,
    children,
  } = props

  return (
    <TableRow>
      <TableCell>{date.toLocaleDateString()}</TableCell>
      <TableCell>{children}</TableCell>
    </TableRow>
  )
}

type SegmentHistoryRowProps = {
  event: EventSession
}

function SegmentHistoryRow(props: SegmentHistoryRowProps) {
  const {event} = props
  const segmentQuery = useSegment(parseInt(event.value))

  return (
    <HistoryRow date={event.date}>
      {segmentQuery.isLoading && "Chargement..."}
      {segmentQuery.isSuccess && (
        <>
          Passage au segment suivant : {segmentQuery.data.attributes.name}
        </>
      )}
    </HistoryRow>
  )
}

type ObstacleHistoryRowProps = {
  event: EventSession
}

function ObstacleHistoryRow(props: ObstacleHistoryRowProps) {
  const {event} = props
  const obstacleQuery = useObstacle(parseInt(event.value))

  return (
    <HistoryRow date={event.date}>
      {obstacleQuery.isLoading && "Chargement..."}
      {obstacleQuery.isSuccess && (
        <>
          Passage de l'obstacle en répondant à la question suivante : {obstacleQuery.data.attributes.riddle}
          <ul>
            <li>{obstacleQuery.data.attributes.response}</li>
          </ul>
        </>
      )}
    </HistoryRow>)
}