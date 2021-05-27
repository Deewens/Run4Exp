import {
  Alert, AlertProps, AlertTitle,
  Box,
  Button, Collapse, Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid, IconButton, InputAdornment, OutlinedInput,
  TextField, Theme, Typography, useTheme
} from "@material-ui/core";
import * as React from "react";
import {SetStateAction, useEffect, useMemo, useRef, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import useUpdateChallenge from "../../../../api/useUpdateChallenge";
import {useRouter} from "../../../../hooks/useRouter";
import {Editor} from '@tinymce/tinymce-react'
import {Challenge} from "../../../../api/entities/Challenge";
import usePublishChallenge from "../../../../api/usePublishChallenge";
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme: Theme) => ({}))

type Props = {
  open: boolean
  setOpen: (value: SetStateAction<boolean>) => void
  challenge: Challenge
}

const UpdateChallengeInfosDialog = (props: Props) => {
  const classes = useStyles()
  const theme = useTheme()
  const {
    open,
    setOpen
  } = props;

  const router = useRouter()
  //@ts-ignore
  let id = parseInt(router.query.id)

  const updateChallenge = useUpdateChallenge()
  const publishChallenge = usePublishChallenge()

  const [challenge, setChallenge] = useState(props.challenge)
  const [name, setName] = useState(challenge.attributes.name)
  const [scale, setScale] = useState(challenge.attributes.scale)
  const [shortDescription, setShortDescription] = useState(challenge.attributes.shortDescription)
  const richTextDescriptionEditorRef = useRef(null)
  const [dirty, setDirty] = useState(false)
  useEffect(() => setDirty(false), [challenge.attributes.description])

  const test = (
    <AlertTitle>test</AlertTitle>
  )

  const [openAlertPublish, setOpenAlertPublish] = useState<boolean>(false)
  const [publishAlertMsg, setPublishAlertMsg] = useState<JSX.Element>(<></>)
  const [publishAlertSeverity, setPublishAlertSeverity] = useState<AlertProps['severity']>("success")

  const handleClose = (e: object, reason: string) => {
    if (reason === "escapeKeyDown" || reason === "backdropClick") return
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false);
  }

  const handleUpdateChallenge = () => {
    if (richTextDescriptionEditorRef.current) {
      //@ts-ignore
      const content = richTextDescriptionEditorRef.current.getContent()
      setDirty(false)
      //@ts-ignore
      richTextDescriptionEditorRef.current.setDirty(false)

      updateChallenge.mutate({
        id: id,
        scale: scale,
        name: name,
        description: content,
        shortDescription: shortDescription,
      }, {
        onSuccess() {
          setOpen(false)
        }
      })
    }
  }

  const handleUnpublishedClick = () => {

  }

  const handlePublishClick = () => {
    publishChallenge.mutate(challenge.id!, {
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
      },
      onSuccess(challenge) {
        setChallenge(challenge)
        setOpenAlertPublish(true)
        setPublishAlertSeverity("success")
        setPublishAlertMsg(
          <div>
            <AlertTitle>Le challenge vient d'être publié</AlertTitle>
            Les utilisateurs peuvent maintenant trouver votre challenge et s'y inscrire.
          </div>
        )
      }
    })
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Informations du challenge</DialogTitle>
      <Divider/>
      <DialogContent>
        <DialogContentText>
          Merci d'indiquer le nom et la description du challenge.
        </DialogContentText>
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                autoFocus
                margin="dense"
                id="challenge-name"
                label="Nom du challenge"
                fullWidth
                sx={{marginBottom: 2}}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                autoFocus
                margin="dense"
                id="challenge-scale"
                label="Échelle de la carte (en m)"
                helperText="L'échelle correspond à la longueur du plus grand côté de la carte"
                fullWidth
                sx={{marginBottom: 2}}
                value={scale}
                inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
                onChange={e => {
                  //@ts-ignore
                  setScale(e.target.value)
                }}
              />
            </Grid>
          </Grid>
          <TextField
            required
            id="challenge-short-description"
            label="Description courte"
            inputProps={{
              maxLength: "255"
            }}
            helperText="255 caractères maximum"
            multiline
            rows={4}
            fullWidth
            sx={{marginBottom: 2}}
            value={shortDescription}
            onChange={e => setShortDescription(e.target.value)}
          />
          <Editor
            //@ts-ignore
            onInit={(evt, editor) => richTextDescriptionEditorRef.current = editor}
            onDirty={() => setDirty(true)}
            apiKey="6pl0iz9g4ca009y51jg1ffvalfrjjh681qs96iqoj86ynoyp"
            initialValue={challenge.attributes.description}
            init={{
              height: 250,
              skin: theme.palette.mode == 'dark' ? 'oxide-dark' : 'oxide',
              content_css: theme.palette.mode == 'dark' ? 'dark' : 'default',
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar: [
                'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help'
              ]
            }}
          />
        </Box>
        <Typography variant="subtitle1">
          Publication du challenge
        </Typography>
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
        {
          !challenge.attributes.published && <Button variant="contained" onClick={handlePublishClick}>Publier</Button>
        }
      </DialogContent>
      <Divider/>
      <DialogActions>
        <Button onClick={handleCancel}>Annuler</Button>
        <Button onClick={handleUpdateChallenge}>Sauvegarder</Button>
      </DialogActions>
    </Dialog>
  )
}

export default UpdateChallengeInfosDialog