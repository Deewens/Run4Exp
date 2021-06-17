import {Challenge} from "../../../../api/entities/Challenge";
import {
  Box, Button,
  CardContent,
  CircularProgress,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Skeleton, Typography
} from "@material-ui/core";
import useChallengeImage from "../../../../api/challenges/useChallengeImage";
import * as React from "react";
import NoImageFoundImage from "../../../../images/no-image-found-image.png";
import useChallenge from "../../../../api/challenges/useChallenge";
import MapView from "../../components/ReadOnlyMap/MapView";

interface Props {
  challengeId: number
  onClose: () => void
  open: boolean
  onRegisterClick: (challengeId: number) => void
}

export default function ChallengeDetailsDialog(props: Props) {
  const {
    challengeId,
    onClose,
    open,
    onRegisterClick,
  } = props

  const challenge = useChallenge(challengeId)
  const image = useChallengeImage(challengeId);
  let imageNotFound = NoImageFoundImage

  if (challenge.isLoading) {
    return (
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <CircularProgress />
      </Box>
    )
  }

  if (challenge.isSuccess) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{challenge.data.attributes.name}</DialogTitle>
        <Divider />
        <DialogContent>
          {image.isLoading && (
            <Skeleton variant="rectangular" width="100%" height="auto" animation="wave" />
          )}

          {image.isSuccess && (
            <MapView challengeId={challengeId} />
          )}
        </DialogContent>
        <Divider />

        <DialogContent>
          <Typography variant="h3">
            Description
          </Typography>
          <div dangerouslySetInnerHTML={{__html: challenge.data.attributes.description}}></div>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => onRegisterClick(challengeId)}>S'inscrire</Button>
          <Button onClick={onClose}>Fermer</Button>
        </DialogActions>
      </Dialog>
    )
  }

  return null
}