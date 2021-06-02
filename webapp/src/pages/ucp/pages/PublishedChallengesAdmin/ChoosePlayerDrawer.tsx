import {
  Avatar, Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemAvatar, ListItemSecondaryAction,
  ListItemText,
  Paper, Skeleton,
  SwipeableDrawer
} from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {MapContainer} from "react-leaflet";
import * as React from "react";
import {useUserSessions} from "../../../../api/useUserSessions";
import useUser from "../../../../api/useUser";
import {useState} from "react";

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

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        sx={{height: 360}}
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
          <ExpandMoreIcon/>
        </IconButton>
        <List dense sx={{width: '100%', maxWidth: 500, maxHeight: 200, bgcolor: 'background.paper', margin: '0 auto',}}>
          {
            userSessions.isLoading
              ? <Skeleton variant="rectangular" height={50}/>
              : (
                userSessions.isSuccess && userSessions.data.map(session => {
                  return <Item key={session.id} sessionId={session.id} userId={session.userId} checked={selectedSessions.indexOf(session.id) !== -1} onChangeCheckbox={handleToggle}/>
                })
              )
          }

        </List>
      </SwipeableDrawer>
    </>
  )
}

interface ItemProps {
  onChangeCheckbox: (userId: number) => () => void
  sessionId: number
  userId: number
  checked: boolean
}

function Item(props: ItemProps) {
  const {
    onChangeCheckbox,
    sessionId,
    userId,
    checked,
  } = props

  const user = useUser(userId)

  if (user.isSuccess) {
    return (
      <ListItem button>
        <ListItemAvatar>
          <Avatar/>
        </ListItemAvatar>
        <ListItemText primary={user.data.firstName + ' ' + user.data.name} />
        <ListItemSecondaryAction>
          <Checkbox
            checked={checked}
            onChange={onChangeCheckbox(sessionId)}
            edge="end"
          />
        </ListItemSecondaryAction>
      </ListItem>
    )
  }

  return null

}