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
import {Obstacle} from "../../../../api/entities/Obstacle";

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

  const [toggleButtons, setToggleButtons] = useState<string[]>(() => [])
  const handleChangeToggleButton = (event: React.MouseEvent<HTMLElement>, newState: string[],) => {
    console.log(toggleButtons)
    setToggleButtons(newState)
    if (newState.includes('checkpoint-locked')) setDraggable(false)
    else setDraggable(true)
  }

  const [selectedObject, setSelectedObject] = useState<Segment | Checkpoint | Obstacle | null>(null)
  useMapEvents({
    click(e) {
      setSelectedObject(null)
      console.log("click event fired on map")
    },
    keydown(e) {
      if (e.originalEvent.key == 'Delete') {
        if (selectedObject instanceof Checkpoint) handleDeleteCheckpoint()
        if (selectedObject instanceof Segment) handleDeleteSegment()
      }
    }
  })

  const deleteSegment = useDeleteSegment()
  const handleDeleteSegment = () => {
    setOpenMenu(false)

    if (selectedObject instanceof Segment) {
      deleteSegment.mutate(selectedObject.id!, {
        onSuccess() {
          queryClient.invalidateQueries(['checkpoints', id])
          queryClient.invalidateQueries(['segments', id])
        }
      })
      setSelectedObject(null)
    }
  }

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

  /*****************************
   **  Checkpoint management  **
   *****************************/
  const [checkpointClicked, setCheckpointClicked] = useState<Checkpoint | null>(null)
  const [draggable, setDraggable] = useState(true)
  const updateCheckpoint = useUpdateCheckpoint()
  const [polyline, setPolyline] = useState<LatLngExpression[]>([]);
  const [anchorPosition, setAnchorPosition] = useState<PopoverPosition>({top: 0, left: 0});
  const [openMenu, setOpenMenu] = useState(false);
  const [isCreateSegmentClicked, setIsCreateSegmentClicked] = useState(false)
  const [checkpointStart, setCheckpointStart] = useState<Checkpoint | null>(null)
  const createSegmentMutation = useCreateSegment()
  const deleteCheckpoint = useDeleteCheckpoint()

  useMapEvents({
    click(e) {
      setCheckpointClicked(null)
      if (polyline.length > 0) {
        setPolyline(prevState => [...prevState, e.latlng])
      }
    },
    mousemove(e) {
      if (polyline.length > 0) {
        let updatedPolylineArray = [...polyline]
        updatedPolylineArray[polyline.length - 1] = e.latlng
        setPolyline(updatedPolylineArray)
      }
    }
  })

  const handleCheckpointContextMenu = (e: LeafletMouseEvent, checkpoint: Checkpoint) => {
    let x = e.originalEvent.clientX
    let y = e.originalEvent.clientY
    setAnchorPosition({top: y, left: x})
    setOpenMenu(true)
    setCheckpointClicked(checkpoint)
  }

  const handleCheckpointClick = (e: LeafletMouseEvent, checkpoint: Checkpoint) => {
    setSelectedObject(checkpoint)

    if (isCreateSegmentClicked) {
      if (polyline.length > 0 && checkpointStart) {
        const coords: Point[] = polyline.map((value) => {
          //@ts-ignore
          return {x: value.lng, y: value.lat}
        })

        coords.pop() // Pop last inserted point by mousemove
        coords.push({x: e.latlng.lng, y: e.latlng.lat}) // Insert point coordinate of the clicked checkpoint

        const length = calculateDistanceBetweenCheckpoint(coords, 100)

        if (checkpointStart.id && checkpoint.id) {
          createSegmentMutation.mutate({
            name: "Segment",
            coordinates: coords,
            length,
            checkpointStartId: checkpointStart.id,
            checkpointEndId: checkpoint.id,
            challengeId: id
          }, {
            onSettled: (data) => {
              setPolyline([])
              setIsCreateSegmentClicked(false)
              setCheckpointClicked(null)
            }
          })
        }
      }
    }
  }

  const handleCreateSegment = () => {
    if (checkpointClicked) {
      setIsCreateSegmentClicked(true)
      setOpenMenu(false)

      let latLng = L.latLng(checkpointClicked.attributes.coordinate.y, checkpointClicked.attributes.coordinate.x)
      setPolyline([latLng, latLng])
      setCheckpointStart(checkpointClicked)
    }
  }

  const handleMoveCheckpoint = () => {
    setDraggable(prevState => !prevState)
    setOpenMenu(false)
  }

  const handleDeleteCheckpoint = () => {
    setOpenMenu(false)

    if (selectedObject instanceof Checkpoint) {
      deleteCheckpoint.mutate(selectedObject.id!, {
        onSuccess() {
          queryClient.invalidateQueries(['checkpoints', id])
          queryClient.invalidateQueries(['segments', id])
        }
      })
      setSelectedObject(null)
    }
  }

  /***********************
   **  Segments Display **
   ***********************/
  const segmentList = useSegments(id)

  /************************
   **  Obstacle Creation **
   ************************/
  const createObstacle = useCreateObstacle()
  const updateObstacle = useUpdateObstacle()
  const [obstacleDistance, setObstacleDistance] = useState<number | string | Array<number | string>>(selectedObject instanceof Segment ? selectedObject.attributes.length / 2 : 0)
  const [obstaclePos, setObstaclePos] = useState<LatLng>(L.latLng(0, 0))

  const handleSliderObstacleChange = (event: Event, newValue: number | number[]) => {
    if (selectedObject instanceof Obstacle) {
      setObstacleDistance(newValue)
      selectedObject.attributes.position = Number(newValue)/100
      // updateObstacle.mutate({
      //   id: selectedObject.id!,
      //   riddle: selectedObject.attributes.riddle,
      //   segmentId: selectedObject.attributes.segmentId,
      //   position: Number(newValue)/100
      // })
    }
  }

  const handleSliderObstacleChangeCommitted = (event: object, value: number | number[]) => {
    if (selectedObject instanceof Obstacle) {
      updateObstacle.mutate({
        id: selectedObject.id!,
        riddle: selectedObject.attributes.riddle,
        segmentId: selectedObject.attributes.segmentId,
        position: Number(value) / 100
      })
    }
  }

  const handleInputObstacleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedObject instanceof Obstacle) {
      setObstacleDistance(event.target.value === '' ? '' : Number(event.target.value))
      selectedObject.attributes.position = Number(event.target.value)

      // updateObstacle.mutate({
      //   id: selectedObject.id!,
      //   riddle: selectedObject.attributes.riddle,
      //   segmentId: selectedObject.attributes.segmentId,
      //   position: Number(event.target.value)
      // })
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
    createObstacle.mutate({segmentId, position: 0.50, riddle: "Question"})
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

  return (
    <>
      {markerPreviewPos && <Marker position={markerPreviewPos} icon={markerIcon}/>}
      {
        checkpointsList.isSuccess && (
          checkpointsList.data.map((checkpoint, index, array) => {
            let latLng: LatLng = L.latLng(checkpoint.attributes.coordinate.y, checkpoint.attributes.coordinate.x)
            const handleDrag = (e: L.LeafletEvent) => {
              setSelectedObject(checkpoint)
              let newLatLng: LatLng = e.target.getLatLng()
              const previousSegments = queryClient.getQueryData<Segment[]>(['segments', id])
              if (previousSegments) {
                let segmentStartsIds = checkpoint.attributes.segmentsStartsIds
                let segmentEndsIds = checkpoint.attributes.segmentsEndsIds

                segmentStartsIds.forEach(segmentId => {
                  let segmentStart = previousSegments.find(segment => segment.id == segmentId)

                  if (segmentStart) {
                    segmentStart.attributes.coordinates[0] = {
                      x: newLatLng.lng,
                      y: newLatLng.lat
                    }
                    const indexToUpdate = previousSegments.findIndex(segment => segmentId == segment.id)
                    previousSegments[indexToUpdate] = segmentStart
                  }
                })

                segmentEndsIds.forEach(segmentId => {
                  let segmentEnd = previousSegments.find(segment => segment.id == segmentId)

                  if (segmentEnd) {
                    segmentEnd.attributes.coordinates[segmentEnd.attributes.coordinates.length - 1] = {
                      x: newLatLng.lng,
                      y: newLatLng.lat
                    }

                    const indexToUpdate = previousSegments.findIndex(segment => segmentId == segment.id)
                    previousSegments[indexToUpdate] = segmentEnd
                  }
                })

                const list = array
                list[index].attributes.coordinate.x = newLatLng.lng
                list[index].attributes.coordinate.y = newLatLng.lat
                queryClient.setQueryData<Segment[]>(['segments', id], previousSegments)
                queryClient.setQueryData<Checkpoint[]>(['checkpoints', id], list)
              }
            }

            const handleDragEnd = (e: L.DragEndEvent) => {
              const list = array
              let newLatLng: LatLng = e.target.getLatLng()
              list[index].attributes.coordinate.x = newLatLng.lng
              list[index].attributes.coordinate.y = newLatLng.lat

              queryClient.setQueryData<Checkpoint[]>(['checkpoints', id], list)
              updateCheckpoint.mutate({
                id: list[index].id || 0,
                position: list[index].attributes.coordinate,
                challengeId: id,
                checkpointType: list[index].attributes.checkpointType,
                name: list[index].attributes.name,
              })
            }

            let icon = (checkpoint.attributes.checkpointType == "BEGIN"
              ? MarkerColors.greenIcon
              : checkpoint.attributes.checkpointType == "END"
                ? MarkerColors.redIcon :
                MarkerColors.blueIcon)

            if (selectedObject instanceof Checkpoint && selectedObject.id == checkpoint.id) {
              icon = (checkpoint.attributes.checkpointType == "BEGIN"
                ? MarkerColors.greenIconSelected
                : checkpoint.attributes.checkpointType == "END"
                  ? MarkerColors.redIconSelected :
                  MarkerColors.blueIconSelected)
            }

            if (checkpoint.id) {
              return (
                <React.Fragment key={checkpoint.id}>
                  {
                    <Marker
                      data-key={checkpoint.id}
                      draggable={draggable}
                      icon={icon}
                      position={latLng}
                      eventHandlers={{
                        drag: (e) => {
                          handleDrag(e)
                        },
                        dragend: (e) => {
                          handleDragEnd(e)
                        },
                        contextmenu: (e) => {
                          handleCheckpointContextMenu(e, checkpoint)
                          setSelectedObject(checkpoint)
                        },
                        click: (e) => {
                          handleCheckpointClick(e, checkpoint)
                        },
                      }}
                    />
                  }
                </React.Fragment>
              )
            }
          })
        )
      }
      {polyline.length > 0 &&
      <Polyline
          positions={polyline}
      />
      }

      <Menu
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        id="simple-menu"
        open={openMenu}
        onClose={() => setOpenMenu(false)}
      >
        <MenuItem onClick={handleCreateSegment}>Créer un segment à partir de ce point</MenuItem>
        <MenuItem onClick={handleDeleteCheckpoint}>Supprimer le checkpoint</MenuItem>
      </Menu>

      {/* SEGMENTS */
        segmentList.isSuccess &&
        segmentList.data.map(segment => {
          let coords: LatLng[] = segment.attributes.coordinates.map((coord) => {
            return L.latLng(coord.y, coord.x);
          });

          return (
            <React.Fragment key={segment.id}>
              <Obstacles
                selectedObstacle={selectedObject instanceof Obstacle ? selectedObject : null}
                eventHandlers={{
                  click(e) {
                    let obstacle: Obstacle = e.target.options['data-obstacle']
                    setSelectedObject(obstacle)
                    setObstacleDistance(obstacle.attributes.position*100)
                  }
                }}
                segment={segment}
                scale={scale}
              />
              <Polyline
                weight={5}
                bubblingMouseEvents={false}
                positions={coords}
                eventHandlers={{
                  click(e) {
                    setSelectedObject(segment)
                    console.log(selectedObject)
                    L.DomEvent.stopPropagation(e);
                  }
                }}
              />
              {
                selectedObject instanceof Segment &&
                selectedObject.id == segment.id &&
                <Polyline
                    weight={6}
                    stroke
                    fillOpacity={0}
                    fillColor="transparent"
                    color="#E3C945"
                    positions={coords}
                />
              }
            </React.Fragment>
          )
        })
      }

      {selectedObject instanceof Obstacle &&
      <>
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
      </>
      }

      {/* MENU */}
      <LeafletControlPanel ref={ref} position="topRight">
        {/*<LeafletControlButton onClick={handleCreateSegmentClick}>*/}
        {/*  <ShowChartIcon fontSize="inherit" sx={{display: 'inline-block', margin: 'auto', padding: '0'}}/>*/}
        {/*</LeafletControlButton>*/}
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