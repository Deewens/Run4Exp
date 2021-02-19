import {
  Box, Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField
} from '@material-ui/core';
import * as React from 'react';
import {SetStateAction, useState} from "react";
import {useMutation} from "react-query";
import {ChallengeCreate} from "@acrobatt";
import Api from "../../api/api";
import {useHistory} from "react-router";
import { useRouteMatch } from 'react-router-dom';

type Props = {
  open: boolean
  setOpen : (value: SetStateAction<boolean>) => void}

const CreateChallengeDialog = (props: Props) => {
  const {
    open,
    setOpen
  } = props;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const history = useHistory();
  const match = useRouteMatch();

  const mutation = useMutation(({name, description}: ChallengeCreate) => Api.createChallenge({name, description}),
    {
      onSuccess: (data) => {
        setOpen(false);
        history.push(`${match.url}/${data.id}`)
      },
    });

  const handleClose = () => {
    setOpen(false);
  }



  const handleCreateChallenge = () => {
    console.log("create challenge");
    mutation.mutate({name, description});
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
            multiline
            rows={5}
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
