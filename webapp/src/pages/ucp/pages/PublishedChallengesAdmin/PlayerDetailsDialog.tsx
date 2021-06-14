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
          Détails sur la session de {user.firstName} {user.name}
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
              Progression actuelle du joueur
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

        {/*<Typography variant="h5">*/}
        {/*  Historique*/}
        {/*</Typography>*/}
        {/*<Typography variant="body1">*/}
        {/*  Tableau affichant l'historique des actions du joueur*/}
        {/*</Typography>*/}
        {/*<TableContainer component={Paper}>*/}
        {/*  <Table>*/}
        {/*    <TableHead>*/}
        {/*      <TableRow>*/}
        {/*        <TableCell>Date de l'évènement</TableCell>*/}
        {/*        <TableCell>Évènement</TableCell>*/}
        {/*      </TableRow>*/}
        {/*    </TableHead>*/}
        {/*    <TableBody>*/}
        {/*      {runs.isSuccess && (*/}
        {/*        runs.data.length > 0 ? (*/}
        {/*          runs.data.map((run, index) => {*/}
        {/*            const startDate = new Date(run.startDate)*/}
        {/*            let endDate = null*/}
        {/*            if (run.endDate) {*/}
        {/*              endDate = new Date(run.endDate)*/}
        {/*            }*/}
        {/*            return (*/}
        {/*              <>*/}
        {/*                <TableRow key={index}>*/}
        {/*                  <TableCell>{startDate.toDateString()}</TableCell>*/}
        {/*                  <TableCell>Début de la session de course</TableCell>*/}
        {/*                </TableRow>*/}
        {/*                <TableRow key={index}>*/}
        {/*                  <TableCell />*/}
        {/*                  <TableCell>{run.advancement.toFixed(2)}m parcourus</TableCell>*/}
        {/*                </TableRow>*/}
        {/*                {run.endDate &&*/}
        {/*                <TableRow key={index}>*/}
        {/*                    <TableCell>{endDate?.toDateString()}</TableCell>*/}
        {/*                    <TableCell>Fin de la session de course</TableCell>*/}
        {/*                </TableRow>*/}
        {/*                }*/}
        {/*              </>*/}
        {/*            )*/}
        {/*          })*/}
        {/*        ) : (*/}
        {/*          <TableRow>*/}
        {/*            <TableCell colSpan={2}>Il n'y a aucun historique pour cet utilisateur</TableCell>*/}
        {/*          </TableRow>*/}
        {/*        )*/}
        {/*      )}*/}
        {/*    </TableBody>*/}
        {/*  </Table>*/}
        {/*</TableContainer>*/}
      </DialogContent>
    </Dialog>
  )
}