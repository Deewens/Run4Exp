import {useMap, useMapEvents} from "react-leaflet";
import * as React from "react";
import StartFlag from "../../../../images/start.svg";
import FinishFlag from "../../../../images/finish-flag.svg";
import LeafletControlPanel from "../../components/Leaflet/LeafletControlPanel";
import {useRouter} from "../../../../hooks/useRouter";
import {Segment} from "../../../../api/entities/Segment";
import {
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
import L from "leaflet";
import {CheckpointType} from "@acrobatt";
import CheckpointCreation from "./CheckpointCreation";
import Checkpoints from "./Checkpoints";
import Segments from "./Segments";
import useCreateObstacle from "../../../../api/useCreateObstacle";
import SegmentCreation from "./SegmentCreation";
import ShowChartIcon from '@material-ui/icons/ShowChart';
import Obstacle from "../../../../api/entities/Obstacle";
import MoveObstacle from "./MoveObstacle";

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
  })

  const [createCheckpointType, setCreateCheckpointType] = useState<CheckpointType | null>(null)
  const handleCreateCheckpointClick = (event: React.MouseEvent<HTMLElement>, checkpointType: CheckpointType) => {
    setCreateCheckpointType(checkpointType)
  }

  const [checkpointsDraggable, setCheckpointsDraggable] = useState(true)


  const [createSegmentClicked, setCreateSegmentClicked] = useState(false)
  const handleSegmentCreated = () => {
    setCreateSegmentClicked(false)
  }

  const handleSegmentCreationCancelled = () => {
    setCreateSegmentClicked(false)
  }

  const createObstacle = useCreateObstacle()
  const handleClickCreateObstacle = () => {
    if (selectedObject instanceof Segment) {
      createObstacle.mutate({segmentId: selectedObject.id!, position: 0.50, riddle: "Question", response: 'Response'})
    }
  }

  return (
    <>
      {createCheckpointType && <CheckpointCreation checkpointType={createCheckpointType} onCheckpointPlaced={() => setCreateCheckpointType(null)}/>}
      <Checkpoints draggable={!checkpointsDraggable} />
      <Segments />
      {createSegmentClicked && <SegmentCreation onSegmentCreated={handleSegmentCreated} onSegmentCreationCancelled={handleSegmentCreationCancelled}/>}
      {selectedObject instanceof Obstacle && <MoveObstacle />}
      {/* MENU */}
      <LeafletControlPanel ref={ref} position="topRight">
        <ToggleButton
          value="create-segment"
          selected={createSegmentClicked}
          size="small"
          sx={{
            backgroundColor: "white",
            border: '1px solid gray',
            marginBottom: theme => theme.spacing(4),
            boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)'
          }}
          onChange={() => setCreateSegmentClicked(prevState => !prevState)}
        >
          <ShowChartIcon />
        </ToggleButton>
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
        <ToggleButton
          value="checkpoint-locked"
          aria-label="Lock checkpoint"
          size="small"
          selected={checkpointsDraggable}
          sx={{
            backgroundColor: "white",
            border: '1px solid gray',
            marginBottom: theme => theme.spacing(4),
            boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)'
          }}
          onChange={() => {
            setCheckpointsDraggable(prevState => !prevState)
          }}
        >
          {checkpointsDraggable ? <LockRoundedIcon /> : <LockOpenRoundedIcon />}
        </ToggleButton>

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