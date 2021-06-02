import * as React from 'react'
import MyChallengeCard from "../../components/MyChallengeCard";
import useSelfUserSessions from "../../../../api/useSelfUserSessions";
import {
  Box, Button,
  CircularProgress,
  Grid,
  Paper,
  Tab,
  Table, TableBody, TableCell,
  TableContainer,
  TableHead, TableRow,
  Tabs,
  Typography
} from "@material-ui/core";
import {useState} from "react";
import {useUserSession} from "../../../../api/useUserSession";
import useChallenge from "../../../../api/useChallenge";
import useUserSessionRuns from "../../../../api/useUserSessionRuns";
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
  const userSessions = useSelfUserSessions()

  const [tabValue, setTabValue] = useState(0)
  const handleChangeTab = (e: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{width: '95%', margin: '0 auto'}}>
      <Box sx={{borderBottom: 1, borderColor: 'divider',}}>
        <Tabs value={tabValue} onChange={handleChangeTab} aria-label="my challenges tab" centered>
          <Tab label="En cours" {...a11yProps(0)} />
          <Tab label="Terminés" {...a11yProps(1)} />
        </Tabs>
        <TabPanel index={0} value={tabValue}>
            <TableContainer component={Paper}>
              <Table sx={{minWidth: 650}} aria-label="ongoing challenges table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nom du challenge</TableCell>
                    <TableCell>Commencé le</TableCell>
                    <TableCell>Dernière mise à jour</TableCell>
                    <TableCell>Complétion (en %)</TableCell>
                    <TableCell>Complétion (en m)</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
              <TableBody>
                {
                  userSessions.isSuccess && userSessions.data.map(userSession => {
                    return <OngoingChallengeRow key={userSession.id} challengeId={userSession.challengeId} userSessionId={userSession.id}/>
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel index={1} value={tabValue}>
          <TableContainer component={Paper}>
            <Table aria-label="ended challenges table">
              <TableHead>
                <TableRow>
                  <TableCell>Nom du challenge</TableCell>
                  <TableCell>Commencé le</TableCell>
                  <TableCell>Terminé le</TableCell>
                  <TableCell>Complétion (en m)</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  userSessions.isSuccess && userSessions.data.map(userSession => {
                    return <EndedChallengeRow key={userSession.id} challengeId={userSession.challengeId} userSessionId={userSession.id}/>
                  })
                }
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
  const runs = useUserSessionRuns(challengeId)

  if (userSession.isSuccess && challenge.isSuccess && runs.isSuccess && !userSession.data.attributes.isEnd) {
    const startDate = new Date(runs.data[0].startDate)
    const updatedDate = new Date(runs.data[runs.data.length - 1].startDate)

    return (
      <TableRow>
        <TableCell>{challenge.data.attributes.name}</TableCell>
        <TableCell>{startDate.toDateString()}</TableCell>
        <TableCell>{updatedDate.toDateString()}</TableCell>
        <TableCell>{userSession.data.attributes.totalAdvancement / challenge.data.attributes.scale * 100}%</TableCell>
        <TableCell>{userSession.data.attributes.totalAdvancement}</TableCell>
        <TableCell><Button component={NavLink} to={`/ucp/my-challenges/${challengeId}?session=${userSessionId}`}>Voir la carte</Button></TableCell>
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
  const runs = useUserSessionRuns(challengeId)

  if (userSession.isSuccess && challenge.isSuccess && runs.isSuccess && userSession.data.attributes.isEnd) {
    const startDate = new Date(runs.data[0].startDate)
    const endDate = new Date(runs.data[runs.data.length - 1].startDate)

    return (
      <TableRow>
        <TableCell>{challenge.data.attributes.name}</TableCell>
        <TableCell>{startDate.toDateString()}</TableCell>
        <TableCell>{endDate.toDateString()}</TableCell>
        <TableCell>{userSession.data.attributes.totalAdvancement.toFixed(2)}</TableCell>
        <TableCell><Button component={NavLink} to={`/ucp/my-challenges/${challengeId}?session=${userSessionId}`}>Voir la carte</Button></TableCell>
      </TableRow>
    )
  }

  return null
}