import * as React from 'react'
import {
  Alert,
  Box, Button, Collapse,
  Dialog, DialogActions,
  DialogContent,
  DialogContentText, DialogProps,
  DialogTitle,
  Divider,
  Grid, IconButton,
  TextField,
  Typography
} from "@material-ui/core";
import {Editor} from "@tinymce/tinymce-react";
import CloseIcon from "@material-ui/icons/Close";
import useChallenge from "../../../../api/challenges/useChallenge";
import {useSegments} from "../../../../api/segments/useSegments";
import {useUserSession} from "../../../../api/user_sessions/useUserSession";
import {useRouter} from "../../../../hooks/useRouter";
import useUrlParams from "../../../../hooks/useUrlParams";

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
          Merci d'indiquer le nom et la description du challenge.
        </DialogContentText>
      </DialogContent>
      <Divider/>
      <DialogActions>
        <Button onClick={() => onClose()}>Fermer</Button>
      </DialogActions>
    </Dialog>
  )
}