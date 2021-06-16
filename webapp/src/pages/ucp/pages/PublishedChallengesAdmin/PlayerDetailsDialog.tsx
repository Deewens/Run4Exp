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
                    Complétion (en %)
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography component="dd" variant="body2">
                    {session.data.attributes.advancement / challenge.data.attributes.scale * 100}%
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography component="dt" variant="h6">
                    Complétion (en m)
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
        <TableContainer component={Paper}>
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

                    if (event.type === 'CHANGE_SEGMENT') {
                      return (
                        <HistoryRow
                          key={index}
                          event={event}
                          segmentData={{isSegment: true, id: parseInt(event.value)}}
                          obstacleData={{isObstacle: false, id: 0}}
                        />
                      )
                    } else if (event.type === 'CHOOSE_PATH') {
                      return (
                        <HistoryRow
                          key={index}
                          event={event}
                          segmentData={{isSegment: true, id: parseInt(event.value)}}
                          obstacleData={{isObstacle: false, id: 0}}
                        />
                      )
                    } else if (event.type === 'PASS_OBSTACLE') {
                      return (
                        <HistoryRow
                          key={index}
                          event={event}
                          segmentData={{isSegment: false, id: 0}}
                          obstacleData={{isObstacle: true, id: parseInt(event.value)}}
                        />
                      )
                    }

                    return (
                      <HistoryRow
                        key={index}
                        event={event}
                        segmentData={{isSegment: false, id: 0}}
                        obstacleData={{isObstacle: false, id: 0}}
                      />
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={2}>Il n'y a aucun historique pour cet utilisateur</TableCell>
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
  event: EventSession
  segmentData: { isSegment: boolean, id: number }
  obstacleData: { isObstacle: boolean, id: number }
}

function HistoryRow(props: HistoryRowProps) {
  const {
    event,
    segmentData,
    obstacleData
  } = props

  const segmentQuery = useSegment(segmentData.id, {
    enabled: segmentData.isSegment
  })

  const obstacleQuery = useObstacle(obstacleData.id, {
    enabled: obstacleData.isObstacle
  })

  let content = ''
  if (event.type === 'BEGIN_RUN') {
    content = 'Début de la session de course'
  } else if (event.type === 'ADVANCE') {
    content = `Avancé de ${event.value}`
  } else if (event.type === 'CHANGE_SEGMENT' && segmentQuery.isSuccess) {
    content = `Changement de segment : ${segmentQuery.data.attributes.name}`
  } else if (event.type === 'CHOOSE_PATH' && segmentQuery.isSuccess) {
    content = `Changement de segment : ${segmentQuery.data.attributes.name}`
  } else if (event.type === 'END') {
    content = `Challenge terminé`
  } else if (event.type === 'PASS_OBSTACLE' && obstacleQuery.isSuccess) {
    content = `Passage par l'obstacle : ${obstacleQuery.data.attributes.riddle}`
  }

  return (
    <TableRow>
      <TableCell>{event.date.toLocaleDateString()}</TableCell>
      <TableCell>{content}</TableCell>
    </TableRow>
  )
}