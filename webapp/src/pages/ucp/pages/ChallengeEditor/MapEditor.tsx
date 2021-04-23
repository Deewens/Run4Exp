import {Marker, Polyline, useMap, useMapEvents} from "react-leaflet";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import L, {LatLng, LatLngBoundsLiteral, LatLngExpression, LeafletMouseEvent} from "leaflet";
import MarkerColors from "../../components/Leaflet/marker-colors";
import {CheckpointType, Point} from "@acrobatt";
import {useCheckpoints} from "../../../../api/useCheckpoints";
import LeafletControlButton from "../../components/Leaflet/LeafletControlButton";
import StartFlag from "../../../../images/start.svg";
import FinishFlag from "../../../../images/finish-flag.svg";
import CancelIcon from "@material-ui/icons/Cancel";
import LeafletControlPanel from "../../components/Leaflet/LeafletControlPanel";
import {useSnackbar} from "notistack";
import useCreateCheckpoint from "../../../../api/useCreateCheckpoint";
import {useRouter} from "../../../../hooks/useRouter";
import {Segment} from "../../../../api/entities/Segment";
import {Checkpoint} from "../../../../api/entities/Checkpoint";
import {
  Box, Button,
  Grid, IconButton,
  Input,
  Menu,
  MenuItem,
  PopoverPosition,
  Slider,
  ToggleButton,
  ToggleButtonGroup
} from "@material-ui/core";
import {useQueryClient} from "react-query";
import useUpdateCheckpoint from "../../../../api/useUpdateCheckpoint";
import {calculateDistanceBetweenCheckpoint, calculatePointCoordOnSegment} from "../../../../utils/orthonormalCalculs";
import useCreateSegment from "../../../../api/useCreateSegment";
import useDeleteCheckpoint from "../../../../api/useDeleteCheckpoint";
import {useSegments} from "../../../../api/useSegments";
import LockIcon from '@material-ui/icons/Lock';
import useDeleteSegment from "../../../../api/useDeleteSegment";
import ViewStreamIcon from '@material-ui/icons/ViewStream';
import Obstacles from './Obstacles'
import {VolumeUp} from "@material-ui/icons";
import useCreateObstacle from "../../../../api/useCreateObstacle";
import useUpdateObstacle from "../../../../api/useUpdateObstacle";
import Obstacle from "../../../../api/entities/Obstacle";
import useMapEditor from "../../../../hooks/useMapEditor";

type Props = {
  bounds: LatLngBoundsLiteral
  scale: number
}

export default function MapEditor(props: Props) {
  const {
    bounds,
    scale
  } = props

  const queryClient = useQueryClient()

  const router = useRouter()

  // Get Challenge Id from URL
  // @ts-ignore
  let id = parseInt(router.query.id)

  const map = useMap()
  const {enqueueSnackbar} = useSnackbar()

  const {selectedObject, setSelectedObject} = useMapEditor()

  useMapEvents({
    click(e) {
      setSelectedObject(null)
    },
  })


  /***************************
   **  Checkpoint creation  **
   ***************************/
  const checkpointsList = useCheckpoints((id))
  const createCheckpointMutation = useCreateCheckpoint()

  const [createCheckpointType, setCreateCheckpointType] = useState<CheckpointType | null>(null)
  const [markerPreviewPos, setMarkerPreviewPos] = useState<LatLng | null>(null)
  const [markerIcon, setMarkerIcon] = useState<L.Icon>(MarkerColors.blueIcon)

  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref && ref.current) {
      L.DomEvent.disableClickPropagation(ref.current)
    }
  })
  const handleCreateCheckpointClick = (event: React.MouseEvent<HTMLElement>, checkpointType: CheckpointType) => {
    setCreateCheckpointType(checkpointType)
    if (checkpointType == "BEGIN") {
      setMarkerIcon(MarkerColors.greenIcon)
    } else if (checkpointType == "END") {
      setMarkerIcon(MarkerColors.redIcon)
    } else {
      setMarkerIcon(MarkerColors.blueIcon)
    }
  }

  useMapEvents({
    mousemove(e: LeafletMouseEvent) {
      let latLng = e.latlng

      if (createCheckpointType) setMarkerPreviewPos(latLng)
    },
    click(e: LeafletMouseEvent) {
      if (createCheckpointType && markerPreviewPos) {
        let imgBounds = L.latLngBounds(bounds)
        if (imgBounds.contains(markerPreviewPos)) {
          if (checkpointsList.isSuccess) {
            const checkpointData = checkpointsList.data
            if (checkpointData.some(checkpoint => checkpoint.attributes.checkpointType == "BEGIN") && createCheckpointType == "BEGIN") {
              enqueueSnackbar("Le point de départ existe déjà. vous ne pouvez pas placer plus d'un point de départ", {
                variant: 'warning'
              })

            } else if (checkpointData.some(checkpoint => checkpoint.attributes.checkpointType == "END") && createCheckpointType == "END") {
              enqueueSnackbar("Le point d'arrivé existe déjà. vous ne pouvez pas placer plus d'un point d'arrivé", {
                variant: 'warning'
              })
            } else {
              createCheckpointMutation.mutate({
                challengeId: id,
                checkpointType: createCheckpointType,
                segmentStartsIds: [],
                segmentEndIds: [],
                name: "check",
                x: markerPreviewPos.lng,
                y: markerPreviewPos.lat
              }, {
                onError(error) {
                  console.log(error.response?.data)
                  // let errors = error.response?.data.errors
                  // errors?.forEach(error => {
                  //   enqueueSnackbar(error, {
                  //     variant: 'error',
                  //   })
                  // })
                }
              })
            }
          }
        }
      }

      setMarkerPreviewPos(null)
      setCreateCheckpointType(null)
    },
    contextmenu(e) {
      if (createCheckpointType) {
        setMarkerPreviewPos(null)
        setCreateCheckpointType(null)
      }
    }
  })

  /************************
   **  Obstacle Creation **
   ************************/
  const createObstacle = useCreateObstacle()
  const updateObstacle = useUpdateObstacle()
  const [obstacleDistance, setObstacleDistance] = useState<number | string | Array<number | string>>(selectedObject instanceof Segment ? selectedObject.attributes.length / 2 : 0)
  const [obstaclePos, setObstaclePos] = useState<LatLng>(L.latLng(0, 0))

  const handleSliderObstacleChange = (event: Event, newValue: number | number[]) => {
    //map.dragging.disable()
    if (selectedObject instanceof Obstacle) {
      setObstacleDistance(newValue)
      //selectedObject.attributes.position = Number(newValue)/100
      console.log(newValue)

      const previousObstacles = queryClient.getQueryData<Obstacle[]>(['obstacles', selectedObject.attributes.segmentId])

      if (previousObstacles) {
        const obstacleToUpdate = previousObstacles.find(obstacle => selectedObject.id == obstacle.id)
        if (obstacleToUpdate) {
          obstacleToUpdate.attributes.position = Number(newValue) / 100
          const indexToUpdate = previousObstacles.findIndex(obstacle => selectedObject.id == obstacle.id)

          previousObstacles[indexToUpdate] = obstacleToUpdate

          queryClient.setQueryData<Obstacle[]>(['obstacles', selectedObject.attributes.segmentId], previousObstacles)
        }
      }
    }
  }

  const handleSliderObstacleChangeCommitted = (event: object, value: number | number[]) => {
    if (selectedObject instanceof Obstacle) {
      updateObstacle.mutate({
        id: selectedObject.id!,
        riddle: selectedObject.attributes.riddle,
        response: selectedObject.attributes.response,
        segmentId: selectedObject.attributes.segmentId,
        position: Number(value) / 100
      })
    }
    map.dragging.enable()
  }

  const handleInputObstacleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedObject instanceof Obstacle) {
      setObstacleDistance(event.target.value === '' ? '' : Number(event.target.value))
      selectedObject.attributes.position = Number(event.target.value)
    }
  }

  const handleInputObstacleBlur = () => {
    if (selectedObject instanceof Segment) {
      if (obstacleDistance < 0) {
        setObstacleDistance(0);
      } else if (obstacleDistance > selectedObject.attributes.length) {
        setObstacleDistance(selectedObject.attributes.length);
      }
    }
  }

  const handleClickCreateObstacle = (segmentId: number) => {
    createObstacle.mutate({segmentId, position: 0.50, riddle: "Question", response: 'Response'})
  }

  useEffect(() => {
    if (selectedObject instanceof Segment) {
      let point = calculatePointCoordOnSegment(selectedObject, Number(obstacleDistance), scale)

      if (point) {
        let latLng = L.latLng(point.y, point.x)
        setObstaclePos(latLng)
      }
    }
  }, [obstacleDistance])

  const [checkpointDraggable, setCheckpointDraggable] = useState(true)
  const [toggleButtons, setToggleButtons] = useState<string[]>(() => [])

  const handleChangeToggleButton = (event: React.MouseEvent<HTMLElement>, newState: string[],) => {
    console.log(toggleButtons)
    setToggleButtons(newState)
    if (newState.includes('checkpoint-locked')) setCheckpointDraggable(false)
    else setCheckpointDraggable(true)
  }

  return (
    <>
      {markerPreviewPos && <Marker position={markerPreviewPos} icon={markerIcon}/>}

      {selectedObject instanceof Obstacle &&
      <div>
          <Box sx={{ width: 250, margin: '0 auto', zIndex: 9999999, }}>
          <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{
                backgroundColor: 'white',
              }}
          >
              <Grid item xs>
                  <Slider
                      value={typeof obstacleDistance === 'number' ? obstacleDistance : 0}
                      step={0.1}
                      max={100}
                      onChange={handleSliderObstacleChange}
                      onChangeCommitted={handleSliderObstacleChangeCommitted}
                      aria-labelledby="input-slider"
                  />
              </Grid>
              <Grid item>
                  <Input
                      value={obstacleDistance}
                      size="small"
                      onChange={handleInputObstacleChange}
                      onBlur={handleInputObstacleBlur}
                      inputProps={{
                        step: 0.1,
                        min: 0,
                        max: 100,
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                      }}
                  />
              </Grid>
          </Grid>
          </Box>
      </div>
      }

      {/* MENU */}
      <LeafletControlPanel ref={ref} position="topRight">
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
          orientation="vertical"
          value={toggleButtons}
          size="small"
          sx={{
            backgroundColor: "white",
            border: '1px solid gray',
            marginBottom: theme => theme.spacing(4),
            boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)'
          }}
          onChange={handleChangeToggleButton}
        >
          <ToggleButton value="checkpoint-locked" aria-label="Lock checkpoint">
            <LockIcon/>
          </ToggleButton>
        </ToggleButtonGroup>

        {selectedObject instanceof Segment &&
        <IconButton
            onClick={() => handleClickCreateObstacle(selectedObject?.id!)}
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






{/*<LeafletControlButton onClick={() => handleCreateCheckpointClick("BEGIN")}*/}
{/*                      active={createCheckpointClicked && createCheckpointType === 'BEGIN'}>*/}
{/*  <img src={StartFlag} alt="Start flag"/>*/}
{/*</LeafletControlButton>*/}
{/*<LeafletControlButton onClick={() => handleCreateCheckpointClick("MIDDLE")}*/}
{/*                      active={createCheckpointClicked && createCheckpointType === 'MIDDLE'}>*/}
{/*  O*/}
{/*</LeafletControlButton>*/}
{/*<LeafletControlButton onClick={() => handleCreateCheckpointClick("END")}*/}
{/*                      active={createCheckpointClicked && createCheckpointType === 'END'}>*/}
{/*  <img src={FinishFlag} alt="Finish flag"/>*/}
{/*</LeafletControlButton>*/}
{/*<LeafletControlButton transparent>*/}
{/*</LeafletControlButton>*/}
{/*<LeafletControlButton active={createCheckpointClicked}>*/}
{/*  <CancelIcon sx={{color: 'black'}}/>*/}
{/*</LeafletControlButton>*/}