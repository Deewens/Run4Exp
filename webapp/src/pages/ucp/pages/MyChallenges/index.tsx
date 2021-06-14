import * as React from 'react'
import MyChallengeCard from "../../components/MyChallengeCard";
import useSelfUserSessions from "../../../../api/user_sessions/useSelfUserSessions";
import {
  Box, Button,
  Paper,
  Tab,
  Table, TableBody, TableCell,
  TableContainer,
  TableHead, TableRow,
  Tabs, Typography
} from "@material-ui/core";
import {useState} from "react";
import {useUserSession} from "../../../../api/user_sessions/useUserSession";
import useChallenge from "../../../../api/challenges/useChallenge";
import useUserSessionRuns from "../../../../api/user_sessions/useUserSessionRuns";
import {NavLink} from "react-router-dom";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{p: 3}}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

export default function MyChallenges() {
  const ongoingUserSessions = useSelfUserSessions({ongoingOnly: true})
  const finishedUserSessions = useSelfUserSessions({finishedOnly: true})

  const [tabValue, setTabValue] = useState(0)
  const handleChangeTab = (e: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{width: '95%', margin: '0 auto'}}>
      <Box sx={{borderBottom: 1, borderColor: 'divider',}}>
        <Tabs value={tabValue}
              onChange={handleChangeTab}
              aria-label="my challenges tab"
              centered>
          <Tab label="En cours" {...a11yProps(0)} />
          <Tab label="Terminés" {...a11yProps(1)} />
        </Tabs>
        <TabPanel index={0} value={tabValue}>
          <Typography variant="body1">
            Retrouvez ici la liste de vos challenges en cours. Vous pouvez cliquer sur l'un d'eux pour voir votre progression actuelle sur une carte.
          </Typography>
          <TableContainer sx={{mt: 2}} component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="ongoing challenges table">
              <TableHead>
                <TableRow>
                  <TableCell>Nom du challenge</TableCell>
                  <TableCell>Dernière mise à jour</TableCell>
                  <TableCell>Complétion (en %)</TableCell>
                  <TableCell>Complétion (en m)</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {ongoingUserSessions.isSuccess && (
                  ongoingUserSessions.data.length > 0 ? ongoingUserSessions.data.map(userSession => {
                    return <OngoingChallengeRow key={userSession.id} challengeId={userSession.attributes.challengeId}
                                                userSessionId={userSession.id!} />
                  }) : (
                    <TableRow>
                      <TableCell colSpan={5}>Vous n'êtes inscrit à aucun challenge</TableCell>
                    </TableRow>
                  )
                )}

                {ongoingUserSessions.isLoading && (
                  <TableRow>
                    <TableCell colSpan={5}>Chargement de la liste...</TableCell>
                  </TableRow>
                )}

                {ongoingUserSessions.isError && (
                  <TableRow>
                    <TableCell colSpan={5}>Une erreur est survenue lors du chargement de la liste</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel index={1} value={tabValue}>
          <Typography variant="body1">
            Retrouvez ici la liste des challenges que vous avez terminé.
          </Typography>
          <TableContainer sx={{mt: 2}} component={Paper}>
            <Table aria-label="ended challenges table">
              <TableHead>
                <TableRow>
                  <TableCell>Nom du challenge</TableCell>
                  <TableCell>Terminé le</TableCell>
                  <TableCell>Complétion (en %)</TableCell>
                  <TableCell>Complétion (en m)</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {finishedUserSessions.isSuccess && (
                  finishedUserSessions.data.length > 0 ? finishedUserSessions.data.map(userSession => {
                    return <EndedChallengeRow key={userSession.id} challengeId={userSession.attributes.challengeId}
                                                userSessionId={userSession.id!} />
                  }) : (
                    <TableRow>
                      <TableCell colSpan={5}>Vous n'avez terminé aucun challenge</TableCell>
                    </TableRow>
                  )
                )}

                {finishedUserSessions.isLoading && (
                  <TableRow>
                    <TableCell colSpan={5}>Chargement de la liste...</TableCell>
                  </TableRow>
                )}

                {finishedUserSessions.isError && (
                  <TableRow>
                    <TableCell colSpan={5}>Une erreur est survenue lors du chargement de la liste</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Box>
    </Box>
  )
}

interface OngoingChallengeRowProps {
  userSessionId: number,
  challengeId: number
}

function OngoingChallengeRow(props: OngoingChallengeRowProps) {
  const {
    userSessionId,
    challengeId,
  } = props

  const userSession = useUserSession(userSessionId)
  const challenge = useChallenge(challengeId)

  if (userSession.isSuccess && challenge.isSuccess) {
    let updatedDate = 'Aucune'

    if (userSession.data.attributes.events.length) {
      updatedDate = userSession.data.attributes.events[userSession.data.attributes.events.length - 1].date.toLocaleDateString()
    }

    return (
      <TableRow>
        <TableCell>{challenge.data.attributes.name}</TableCell>
        <TableCell>{updatedDate}</TableCell>
        <TableCell>{userSession.data.attributes.advancement / challenge.data.attributes.scale * 100}%</TableCell>
        <TableCell>{userSession.data.attributes.advancement}</TableCell>
        <TableCell>
          <Button component={NavLink} to={`/ucp/my-challenges/${challengeId}?session=${userSessionId}`}>Voir la carte</Button>
        </TableCell>
      </TableRow>
    )
  }

  return null
}

function EndedChallengeRow(props: OngoingChallengeRowProps) {
  const {
    userSessionId,
    challengeId,
  } = props

  const userSession = useUserSession(userSessionId)
  const challenge = useChallenge(challengeId)

  if (userSession.isSuccess && challenge.isSuccess) {
    const endDate = userSession.data.attributes.events[userSession.data.attributes.events.length - 1].date

    return (
      <TableRow>
        <TableCell>{challenge.data.attributes.name}</TableCell>
        <TableCell>{endDate.toDateString()}</TableCell>
        <TableCell>{userSession.data.attributes.advancement / challenge.data.attributes.scale * 100}%</TableCell>
        <TableCell>{userSession.data.attributes.advancement}</TableCell>
        <TableCell>
          <Button component={NavLink} to={`/ucp/my-challenges/${challengeId}?session=${userSessionId}`}>Voir la carte</Button>
        </TableCell>
      </TableRow>
    )
  }

  return null
}