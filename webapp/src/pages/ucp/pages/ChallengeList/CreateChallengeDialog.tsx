import {
  Box, Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField
} from '@material-ui/core'
import * as React from 'react'
import {SetStateAction, useState} from "react"
import useCreateChallenge from "../../../../api/useCreateChallenge"
import {useRouter} from "../../../../hooks/useRouter"

type Props = {
  open: boolean
  setOpen : (value: SetStateAction<boolean>) => void
}

const CreateChallengeDialog = (props: Props) => {
  const {
    open,
    setOpen
  } = props;

  const mutation = useCreateChallenge();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleClose = () => {
    setOpen(false);
  }


  const handleCreateChallenge = () => {
    mutation.mutate({name, description: "<p>Description riche</p>", shortDescription: description, scale: 100}, {
      onSuccess: (data) => {
        router.push(`/ucp/challenge-editor/${data.id}`)
      },
      onError(error) {
        console.log(error.response)
      }
    })
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Créer un challenge</DialogTitle>
      <Divider/>

      <DialogContent>
        <DialogContentText>
          Merci d'indiquer le nom et la description du challenge que vous voulez créer. Une fois fait, vous pourrez
          choisir le fond à appliquer à votre challenge et pourrez commencer sa création.
        </DialogContentText>
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
          <TextField
            required
            autoFocus
            margin="dense"
            id="challenge-name"
            label="Nom du challenge"
            fullWidth
            variant="standard"
            sx={{marginBottom: 2}}
            onChange={e => setName(e.target.value)}
          />
          <TextField
            required
            id="challenge-description"
            label="Description"
            inputProps={{
              maxLength: "255"
            }}
            helperText="255 caractères maximum"
            multiline
            rows={4}
            fullWidth
            variant="standard"
            onChange={e => setDescription(e.target.value)}
          />
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button onClick={handleCreateChallenge}>Créer</Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateChallengeDialog;
