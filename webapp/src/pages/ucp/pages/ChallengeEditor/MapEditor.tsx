import {useMap, useMapEvents} from "react-leaflet";
import * as React from "react";
import StartFlag from "../../../../images/start.svg";
import FinishFlag from "../../../../images/finish-flag.svg";
import LeafletControlPanel from "../../components/Leaflet/LeafletControlPanel";
import {useRouter} from "../../../../hooks/useRouter";
import {Segment} from "../../../../api/entities/Segment";
import {
  alpha,
  IconButton,
  ToggleButton,
  ToggleButtonGroup
} from "@material-ui/core";
import {useQueryClient} from "react-query";
import LockOpenRoundedIcon from '@material-ui/icons/LockOpenRounded';
import LockRoundedIcon from '@material-ui/icons/LockRounded';
import ViewStreamIcon from '@material-ui/icons/ViewStream';
import useMapEditor from "../../../../hooks/useMapEditor";
import useChallenge from "../../../../api/useChallenge";
import {useEffect, useRef, useState} from "react";
import L, {LineUtil} from "leaflet";
import {CheckpointType} from "@acrobatt";
import CheckpointCreation from "./CheckpointCreation";
import Checkpoints from "./Checkpoints";
import Segments from "./Segments";
import useCreateObstacle from "../../../../api/useCreateObstacle";
import SegmentCreation from "./SegmentCreation";
import ShowChartIcon from '@material-ui/icons/ShowChart';
import Obstacle from "../../../../api/entities/Obstacle";
import MoveObstacle from "./MoveObstacle"

type Props = {}

export default function MapEditor(props: Props) {
  const {} = props

  const queryClient = useQueryClient()

  const router = useRouter()
  // Get Challenge Id from URL
  const challengeId = parseInt(router.query.id)

  const {selectedObject, setSelectedObject} = useMapEditor()

  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref?.current) {
      L.DomEvent.disableClickPropagation(ref.current)
    }
  })

  useMapEvents({
    contextmenu(e) {
      setCreateCheckpointType(null)
    },
    keydown(e) {
      if (e.originalEvent.key === 'Escape') {
        setSelectedObject(null)
      }
    }
  })

  const [createCheckpointType, setCreateCheckpointType] = useState<CheckpointType | null>(null)
  const handleCreateCheckpointClick = (event: React.MouseEvent<HTMLElement>, checkpointType: CheckpointType) => {
    setCreateCheckpointType(checkpointType)
  }

  const [checkpointsDraggable, setCheckpointsDraggable] = useState<string | null>(null)

  const [createSegmentValueBtn, setCreateSegmentValueBtn] = useState<string | null>(null)

  const handleSegmentCreated = () => {
    setCreateSegmentValueBtn(null)
  }

  const handleSegmentCreationCancelled = () => {
    setCreateSegmentValueBtn(null)
  }

  const createObstacle = useCreateObstacle()
  const handleClickCreateObstacle = () => {
    if (selectedObject instanceof Segment) {
      createObstacle.mutate({segmentId: selectedObject.id!, position: 0.50, riddle: "Question ?", response: 'Réponse...'})
    }
  }

  return (
    <>
      {selectedObject instanceof Obstacle && <MoveObstacle />}

      {createCheckpointType && <CheckpointCreation checkpointType={createCheckpointType} onCheckpointPlaced={() => setCreateCheckpointType(null)}/>}
      <Checkpoints draggable={checkpointsDraggable !== 'checkpoint-locked'} />
      <Segments />
      {createSegmentValueBtn === 'create-segment'  && <SegmentCreation onSegmentCreated={handleSegmentCreated} onSegmentCreationCancelled={handleSegmentCreationCancelled}/>}
      {/* MENU */}
      <LeafletControlPanel ref={ref} position="topRight">
        <ToggleButtonGroup
          size="small"
          value={createSegmentValueBtn}
          exclusive
          sx={{
            backgroundColor: "white",
            border: '1px solid gray',
            marginBottom: theme => theme.spacing(4),
            boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)'
          }}
          onChange={(e, newValue) => setCreateSegmentValueBtn(newValue)}
        >
        <ToggleButton value="create-segment">
          <ShowChartIcon />
        </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          orientation="vertical"
          value={createCheckpointType}
          size="small"
          exclusive
          sx={{
            backgroundColor: "white",
            border: '1px solid gray',
            marginBottom: theme => theme.spacing(4),
            boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)'
          }}
          onChange={handleCreateCheckpointClick}
        >
          <ToggleButton value="BEGIN">
            <img src={StartFlag} alt="Start flag"/>
          </ToggleButton>
          <ToggleButton value="MIDDLE">
            O
          </ToggleButton>
          <ToggleButton value="END">
            <img src={FinishFlag} alt="Finish flag"/>
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          size="small"
          value={checkpointsDraggable}
          exclusive
          sx={{
          backgroundColor: "white",
          border: '1px solid gray',
          marginBottom: theme => theme.spacing(4),
          boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)'
        }}
          onChange={(e, newValue) => {
            setCheckpointsDraggable(newValue)
          }}
        >
          <ToggleButton value="checkpoint-locked">
            {checkpointsDraggable === 'checkpoint-locked' ? <LockRoundedIcon /> : <LockOpenRoundedIcon />}
          </ToggleButton>
        </ToggleButtonGroup>


        {selectedObject instanceof Segment &&
        <IconButton
            onClick={handleClickCreateObstacle}
            size="small"
            sx={{
              backgroundColor: "white",
              border: '1px solid gray',
              borderRadius: '4px',
              padding: '7px',
              boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)'
            }}
        >
            <ViewStreamIcon/>
        </IconButton>
        }
      </LeafletControlPanel>
    </>
  )
}