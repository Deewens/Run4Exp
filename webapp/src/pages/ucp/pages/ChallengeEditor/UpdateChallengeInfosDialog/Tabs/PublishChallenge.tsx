import {
  Alert,
  AlertProps,
  AlertTitle,
  Box,
  Button,
  Collapse,
  Dialog, DialogActions,
  DialogContent, DialogContentText,
  DialogTitle,
  IconButton,
  Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Challenge} from "../../../../../../api/entities/Challenge";
import usePublishChallenge from "../../../../../../api/hooks/challenges/usePublishChallenge";
import {useQueryClient} from "react-query";
import queryKeys from "../../../../../../api/queryKeys";
import useChallenge from "../../../../../../api/hooks/challenges/useChallenge";

interface Props {
  challengeId: number
}

export default function PublishChallenge(props: Props) {
  const challenge = useChallenge(props.challengeId)

  const publishChallenge = usePublishChallenge()
  const queryClient = useQueryClient()

  const [openAlertPublish, setOpenAlertPublish] = useState<boolean>(false)
  const [publishAlertMsg, setPublishAlertMsg] = useState<JSX.Element>(<></>)
  const [publishAlertSeverity, setPublishAlertSeverity] = useState<AlertProps['severity']>("success")

  const handlePublishClick = useCallback(() => {
    if (!challenge.isSuccess) return
    publishChallenge.mutate(challenge.data.id!, {
      onError(error) {
        setOpenAlertPublish(true)
        setPublishAlertSeverity("warning")
        setPublishAlertMsg(
          <div>
            <AlertTitle>Impossible de publier le challenge</AlertTitle>
            Vous ne pouvez pas publier le challenge en l'état.
            <ul>
              <li>Vérifier si il y a un checkpoint de début et de fin</li>
              <li>Vérifier qu'il n'y ai pas de cul de sac</li>
            </ul>
          </div>
        )
        setOpenConfirmDialog(false)
      },
      onSuccess(challenge) {
        setOpenAlertPublish(true)
        queryClient.setQueryData<Challenge>([queryKeys.CHALLENGES, challenge.id], old => new Challenge({...old?.attributes, published: true,}, old?.id))
        setOpenConfirmDialog(false)
      }
    })
  }, [])

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

  return (
    <>
      {challenge.isSuccess && !challenge.data.attributes.published ? (
        <>
          <Alert sx={{mb: 2,}} variant="filled" severity="info">
            <AlertTitle>Publication du challenge</AlertTitle>
            <Typography variant="body2">
              Une fois que vous êtes satisfait du challenge que vous avez créé, vous pouvez le publier.
              Lors de la publication de votre challenge, un algorithme vérifiera automatiquement sa validité dont voici
              les
              critères à respecter :
              <ul>
                <li><strong>Ne pas avoir de cul-de-sac</strong></li>
                <li><strong>Avoir un checkpoint représentant le début et la fin</strong></li>
                <li><strong>Le checkpoint de début et de fin ne sont connecté que par un seul segment</strong></li>
              </ul>
              Ces paramètres sont sujets à évoluer dans les futurs mis à jour.<br/>
              Une fois votre challenge publié, il vous sera impossible de modifier son tracé. Vous pourrez cependant
              modifier les informations élémentaires comme le nom, la description et gérer les administrateurs.<br/>
              La publication d'un challenge est un processus à sens unique, une fois que vous l'avez publié, <strong>il
              n'y
              a pas de retour en arrière possible</strong>, soyez donc bien sûr de vous !
            </Typography>
          </Alert>
          <Collapse in={openAlertPublish}>
            <Alert
              severity={publishAlertSeverity}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setOpenAlertPublish(false)}
                >
                  <CloseIcon fontSize="inherit"/>
                </IconButton>
              }
              sx={{mb: 2}}
            >
              {publishAlertMsg}
            </Alert>
          </Collapse>
          <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',}}>
            <Typography variant="h6">
              Lors que vous êtes prêt à publier le challenge, cliquez sur ce bouton.
            </Typography>

            <Button size="large" variant="contained" onClick={() => setOpenConfirmDialog(true)}>Publier</Button>
          </Box>
          <ConfirmDialog open={openConfirmDialog} onClose={(value) => value ? handlePublishClick() : setOpenConfirmDialog(false)}/>
        </>
      ) : challenge.isSuccess && (
        <>
          <Alert sx={{mb: 2,}} variant="filled" severity="success">
            <AlertTitle>Challenge publié</AlertTitle>
            <Typography variant="body2">
              Ce challenge est publié. Les utilisateurs peuvent s'y inscrire.
            </Typography>
          </Alert>
        </>
      )}
    </>
  )
}

interface ConfirmDialogProps {
  open: boolean
  onClose: (value: boolean) => void
}

function ConfirmDialog(props: ConfirmDialogProps) {
  const {onClose, open,} = props;

  return (
    <Dialog
      open={open}
      maxWidth="xs"
    >
      <DialogTitle>Etes-vous sûr de vouloir publier ?</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          <strong>ATTENTION :</strong> vous êtes sur le point de publier le challenge, cette action est irréversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => onClose(false)}>
          Annuler
        </Button>
        <Button autoFocus onClick={() => onClose(true)}>
          Publier
        </Button>
      </DialogActions>
    </Dialog>
  )
}