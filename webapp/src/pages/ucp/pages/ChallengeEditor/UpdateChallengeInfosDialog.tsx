import {
  Box,
  Button, Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField, Theme, useTheme
} from "@material-ui/core";
import * as React from "react";
import {SetStateAction, useEffect, useMemo, useRef, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import useUpdateChallenge from "../../../../api/useUpdateChallenge";
import {useRouter} from "../../../../hooks/useRouter";
import { Editor } from '@tinymce/tinymce-react'

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    // width: '100%',
    //
    // border: '1px solid black',
  },
  editor: {
    // minHeight: '300px',
    // overflow: 'auto',
  }
}))

type Props = {
  open: boolean
  setOpen: (value: SetStateAction<boolean>) => void
  name: string
  shortDescription: string
  htmlDescription: string
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

  const [name, setName] = useState(props.name)
  const [shortDescription, setShortDescription] = useState(props.shortDescription)
  const [richTextDescription, setRichTextDescription] = useState("")

  const handleClose = (e: object, reason: string) => {
    if (reason === "escapeKeyDown" || reason === "backdropClick") return
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false);
  }

  const handleUpdateChallenge = () => {
    updateChallenge.mutate({
      id: id,
      scale: 100,
      name: name,
      description: shortDescription
    }, {
      onSuccess() {
        setOpen(false)
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
          <TextField
            required
            autoFocus
            margin="dense"
            id="challenge-name"
            label="Nom du challenge"
            sx={{marginBottom: 2, width: 400}}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <TextField
            required
            id="challenge-short-description"
            label="Description courte"
            multiline
            rows={3}
            fullWidth
            sx={{marginBottom: 2}}
            value={shortDescription}
            onChange={e => setShortDescription(e.target.value)}
          />
          <Editor
            apiKey="6pl0iz9g4ca009y51jg1ffvalfrjjh681qs96iqoj86ynoyp"
            initialValue="<p><strong>CEci est un test</strong></p>"
            init={{
              height: 250,
              skin: theme.palette.mode == 'dark' ?  'oxide-dark' : 'default',
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
            onEditorChange={(content, editor) => setRichTextDescription(content)}
          />
        </Box>
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