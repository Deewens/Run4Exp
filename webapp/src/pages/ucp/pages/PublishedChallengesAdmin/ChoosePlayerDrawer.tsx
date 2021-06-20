import {
  Avatar, Box, Button, Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemAvatar, ListItemSecondaryAction,
  ListItemText,
  Paper, Skeleton,
  SwipeableDrawer, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {MapContainer} from "react-leaflet";
import * as React from "react";
import {useUserSessions} from "../../../../api/hooks/user_sessions/useUserSessions";
import useUser from "../../../../api/hooks/user/useUser";
import {useState} from "react";
import PlayerDetailsDialog from "./PlayerDetailsDialog";
import {useUserSession} from "../../../../api/hooks/user_sessions/useUserSession";

interface Props {
  challengeId: number
  open: boolean
  onClose: (event: React.KeyboardEvent | React.MouseEvent) => void
  onOpen: (event: React.KeyboardEvent | React.MouseEvent) => void
  selectedSessions: number[]
  setSelectedSessions: React.Dispatch<React.SetStateAction<number[]>>
}


export default function ChoosePlayerDrawer(props: Props) {
  const {
    challengeId,
    open,
    onClose,
    onOpen,
    selectedSessions,
    setSelectedSessions,
  } = props

  const userSessions = useUserSessions(challengeId)

  const handleToggle = (sessionId: number) => () => {
    const currentIndex = selectedSessions.indexOf(sessionId)
    const newChecked = [...selectedSessions]
    if (currentIndex === -1) {
      newChecked.push(sessionId)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setSelectedSessions(newChecked)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && userSessions.isSuccess) {

      const newSelecteds = userSessions.data.map((n) => n.id!)
      setSelectedSessions(newSelecteds)
      return
    }
    setSelectedSessions([]);
  };

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        sx={{height: 360,}}
      >
        <IconButton
          sx={{
            borderTopLeftRadius: '1em',
            borderTopRightRadius: '1em',
            position: 'relative',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
          onClick={onClose}
        >
          <ExpandMoreIcon />
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body1" align="center" sx={{maxWidth: 500, margin: '0 auto',}}>
            Les cases à cocher permettent d'afficher un joueur sur la carte. Vous pouvez également visualiser les
            détails
            sur un joueur en cliquant sur le bouton "Détails".
          </Typography>
          {userSessions.isSuccess && (
            <TableContainer sx={{maxWidth: 600, maxHeight: 250, margin: '0 auto',}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={selectedSessions.length > 0 && selectedSessions.length < userSessions.data.length}
                        checked={userSessions.data.length > 0 && userSessions.data.length === selectedSessions.length}
                        onChange={handleSelectAllClick}
                        inputProps={{
                          'aria-label': 'select all sessions'
                        }}
                      />
                    </TableCell>
                    <TableCell>Prénom</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Challenge terminé ?</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userSessions.data.length > 0 ? (
                    userSessions.data.map(session => (
                      <Item key={session.id} sessionId={session.id!} userId={session.attributes.userId}
                            checked={selectedSessions.indexOf(session.id!) !== -1} onChangeCheckbox={handleToggle}
                            challengeId={challengeId} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3}>Aucun utilisateur n'est inscrit au challenge</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </SwipeableDrawer>
    </>
  )
}

interface ItemProps {
  onChangeCheckbox: (userId: number) => () => void
  sessionId: number
  userId: number
  checked: boolean
  challengeId: number
}

function Item(props: ItemProps) {
  const {
    onChangeCheckbox,
    sessionId,
    userId,
    checked,
    challengeId,
  } = props

  const user = useUser(userId)
  const session = useUserSession(sessionId)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)



  if (user.isSuccess && session.isSuccess) {
    const isEnd = session.data.attributes.events.find(event => event.type === "END")

    return (
      <>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              checked={checked}
              onChange={onChangeCheckbox(sessionId)}
              edge="end"
            />
          </TableCell>
          <TableCell>{user.data.firstName}</TableCell>
          <TableCell>{user.data.name}</TableCell>
          <TableCell>{isEnd ? "Terminé" : "En cours"}</TableCell>
          <TableCell><Button onClick={() => setDetailsDialogOpen(true)}>Détails</Button></TableCell>
        </TableRow>
        <PlayerDetailsDialog open={detailsDialogOpen} user={user.data} sessionId={sessionId}
                             onClose={() => setDetailsDialogOpen(false)} challengeId={challengeId} />
      </>
    )
  }

  return null

}