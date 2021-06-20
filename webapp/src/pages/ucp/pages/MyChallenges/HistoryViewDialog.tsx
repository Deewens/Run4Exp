import * as React from 'react'
import {
  Alert,
  Box, Button, Collapse,
  Dialog, DialogActions,
  DialogContent,
  DialogContentText, DialogProps,
  DialogTitle,
  Divider,
  Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField,
  Typography
} from "@material-ui/core";
import {Editor} from "@tinymce/tinymce-react";
import CloseIcon from "@material-ui/icons/Close";
import useChallenge from "../../../../api/hooks/challenges/useChallenge";
import {useSegments} from "../../../../api/hooks/segments/useSegments";
import {useUserSession} from "../../../../api/hooks/user_sessions/useUserSession";
import {useRouter} from "../../../../hooks/useRouter";
import useUrlParams from "../../../../hooks/useUrlParams";
import useUserSessionRuns from "../../../../api/hooks/user_sessions/useUserSessionRuns";

type Props = {
  challengeId: number
  sessionId: number
  open: boolean
  onClose: () => void
}

export default function HistoryViewDialog(props: Props) {
  const {
    challengeId,
    sessionId,
    open,
    onClose,
  } = props


  const challenge = useChallenge(challengeId)
  const userSession = useUserSession(sessionId)

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Historique</DialogTitle>
      <Divider/>
      <DialogContent>
        <DialogContentText>
          Retrouvez votre historique d'évènement ici.
        </DialogContentText>
        <History userSessionId={sessionId}/>
      </DialogContent>
      <Divider/>
      <DialogActions>
        <Button onClick={() => onClose()}>Fermer</Button>
      </DialogActions>
    </Dialog>
  )
}

interface HistoryProps {
  userSessionId: number
}

function History(props: HistoryProps) {
  const {
    userSessionId,
  } = props

  const runs = useUserSessionRuns(userSessionId)

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date de l'évènement</TableCell>
            <TableCell>Évènement</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {runs.isSuccess && runs.data.map((run, index) => {
            const startDate = new Date(run.startDate)
            let endDate = null
            if (run.endDate) {
              endDate = new Date(run.endDate)
            }
            return (
              <>
                <TableRow
                  key={index}
                >
                  <TableCell>{startDate.toDateString()}</TableCell>
                  <TableCell>Début de la session de course</TableCell>
                </TableRow>
                <TableRow
                  key={index}
                >
                  <TableCell/>
                  <TableCell>{run.advancement.toFixed(2)}m parcourus</TableCell>
                </TableRow>
                {run.endDate &&
                  <TableRow
                    key={index}
                  >
                    <TableCell>{endDate?.toDateString()}</TableCell>
                    <TableCell>Fin de la session de course</TableCell>
                  </TableRow>
                }
              </>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

