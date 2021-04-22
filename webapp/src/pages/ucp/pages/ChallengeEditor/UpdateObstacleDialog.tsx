import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem
} from "@material-ui/core";
import UpdateObstacleDialogTabs from "./UpdateObstacleDialogTabs";
import {makeStyles} from "@material-ui/core/styles";
import Obstacle from "../../../../api/entities/Obstacle";

type Props = {
  open: boolean
  onClose: () => void
  obstacle: Obstacle
}

const useStyles = makeStyles(theme => ({
  dialogPaper: {
    minHeight: theme.breakpoints.values.sm,
  }
}))

export default function UpdateObstacleDialog(props: Props) {
  const {
    open,
    onClose,
    obstacle
  } = props
  const classes = useStyles()

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog
      classes={{
        paper: classes.dialogPaper,
      }}
      fullWidth
      maxWidth="lg"
      onClose={handleClose}
      aria-labelledby="Paramétrer un obstacle"
      open={open}
    >
      <DialogTitle>Paramétrage de l'obstacle</DialogTitle>
      <Divider/>
      <DialogContent>
        <UpdateObstacleDialogTabs obstacle={obstacle}/>
      </DialogContent>
      <Divider/>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleClose}>Subscribe</Button>
      </DialogActions>
    </Dialog>
  )
}

