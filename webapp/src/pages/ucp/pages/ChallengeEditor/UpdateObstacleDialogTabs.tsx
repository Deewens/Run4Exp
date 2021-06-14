import {Box, CircularProgress, Container, Input, Tab, Tabs, TextField, Theme, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Obstacle from "../../../../api/entities/Obstacle";
import useUpdateObstacle from "../../../../api/obstacles/useUpdateObstacle";
import useMapEditor from "../../../../hooks/useMapEditor";
import {useSnackbar} from "notistack";

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props;

  return (
    <div
      style={{margin: '0 auto'}}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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
    id: `vertical-tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
}));

type Props = {
  obstacle: Obstacle
}

export default function UpdateObstacleDialogTabs(props: Props) {
  const {
    obstacle
  } = props
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const {selectedObject, setSelectedObject} = useMapEditor()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  }

  const updateObstacle = useUpdateObstacle()
  const {enqueueSnackbar} = useSnackbar()


  const handleRiddleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (selectedObject instanceof Obstacle && selectedObject.attributes.riddle !== e.target.value) {
      updateObstacle.mutate({
        id: obstacle.id!,
        position: obstacle.attributes.position,
        riddle: e.target.value,
        response: obstacle.attributes.response,
        segmentId: obstacle.attributes.segmentId
      }, {
        onSuccess(data) {
          setSelectedObject(data)
          enqueueSnackbar("Question mise à jour", {variant: "success"})
        }
      })
    }
  }

  const handleResponseBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (selectedObject instanceof Obstacle && selectedObject.attributes.response !== e.target.value) {
      updateObstacle.mutate({
        id: obstacle.id!,
        position: obstacle.attributes.position,
        riddle: obstacle.attributes.riddle,
        response: e.target.value,
        segmentId: obstacle.attributes.segmentId
      }, {
        onSuccess(data) {
          setSelectedObject(data)
          enqueueSnackbar("Réponse mise à jour", {variant: "success"})
        }
      })
    }
  }

  /*
   * Riddle
   */
  const [riddle, setRiddle] = useState<string>('')
  const [response, setResponse] = useState<string>('')

  useEffect(() => {
    if (selectedObject instanceof Obstacle) {
      setRiddle(selectedObject.attributes.riddle)
      setResponse(selectedObject.attributes.response)
    }
  }, [])

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        className={classes.tabs}
      >
        <Tab label="Énigme" {...a11yProps(0)} />
        <Tab label="Action (Non disponible)" {...a11yProps(1)} disabled />
      </Tabs>
      <TabPanel value={value} index={0}>
        <form className={classes.form} onSubmit={(e) => e.preventDefault()}>
          <TextField
            fullWidth
            onBlur={handleRiddleBlur}
            variant="outlined"
            margin="normal"
            label="Question de l'énigme"
            value={riddle}
            onChange={(e) => setRiddle(e.target.value)}
          />
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            label="Réponse de l'énigme"
            value={response}
            onBlur={handleResponseBlur}
            onChange={(e) => setResponse(e.target.value)}
          />
        </form>
      </TabPanel>
    </div>
  );
}