import * as React from 'react';
import L, {LatLng, LatLngExpression, LeafletMouseEvent} from "leaflet";
import {Marker, Polyline, useMapEvents} from 'react-leaflet';
import {CheckpointsApi as CheckpointsType, useCheckpoints} from "../../api/useCheckpoints";
import {useRouter} from "../../hooks/useRouter";
import {createRef, RefObject, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Point} from "@acrobatt";
import useCreateSegment from "../../api/useCreateSegment";
import {calculateDistanceBetweenCheckpoint} from "../../utils/orthonormalCalculs";
import {Menu, MenuItem, PopoverPosition} from "@material-ui/core";
import MarkerColors from "../Leaflet/marker-colors";
import {useQueryClient} from "react-query";
import {SegmentApi} from "../../api/useSegments";
import {Segment} from "../../api/entities/Segment";
import {Checkpoint} from "../../api/entities/Checkpoint";
import useUpdateCheckpoint from "../../api/useUpdateCheckpoint";
import useDeleteCheckpoint from "../../api/useDeleteCheckpoint";
import {Marker as LeafletMarker} from 'leaflet'
import Leaflet from "leaflet";

type Props = {
  onCheckpointClick(e: LeafletMouseEvent, checkpoint: Checkpoint): void
}

const Checkpoints = ({onCheckpointClick}: Props) => {
  const router = useRouter()
  // @ts-ignore
  let {id} = router.query;

  const queryClient = useQueryClient()

  const checkpointsList = useCheckpoints(parseInt(id));
  const updateCheckpoint = useUpdateCheckpoint()
  const deleteCheckpoint = useDeleteCheckpoint()

  const createSegmentMutation = useCreateSegment()

  const [checkpointStart, setCheckpointStart] = useState<Checkpoint | null>(null)
  const [polyline, setPolyline] = useState<LatLngExpression[]>([]);

  const [isCreateSegmentClicked, setIsCreateSegmentClicked] = useState(false)
  const [checkpointClicked, setCheckpointClicked] = useState<Checkpoint | null>(null)

  const [openMenu, setOpenMenu] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<PopoverPosition>({top: 0, left: 0});

  const [draggable, setDraggable] = useState(false)

  const handleCreateSegment = () => {
    if (checkpointClicked) {
      setIsCreateSegmentClicked(true)
      setOpenMenu(false)

      let latLng = L.latLng(checkpointClicked.attributes.coordinate.y, checkpointClicked.attributes.coordinate.x)
      setPolyline([latLng, latLng])
      setCheckpointStart(checkpointClicked)
    }
  }

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

  const handleCheckpointClick = (e: LeafletMouseEvent, checkpoint: Checkpoint) => {
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

  const handleCheckpointContextMenu = (e: LeafletMouseEvent, checkpoint: Checkpoint) => {
    let x = e.originalEvent.clientX
    let y = e.originalEvent.clientY
    setAnchorPosition({top: y, left: x})
    setOpenMenu(true)
    setCheckpointClicked(checkpoint)
  }


  const handleMoveCheckpoint = () => {
    setDraggable(prevState => !prevState)
    setOpenMenu(false)
  }

  const handleDeleteCheckpoint = () => {
    setOpenMenu(false)

    if (checkpointClicked) {
      deleteCheckpoint.mutate(checkpointClicked.id!, {
        onSuccess() {
          queryClient.invalidateQueries(['checkpoints', parseInt(id)])
          queryClient.invalidateQueries(['segments', parseInt(id)])
        }
      })
      setCheckpointClicked(null)
    }
  }

  return (
    <>
      {
        checkpointsList.isSuccess && (
          checkpointsList.data.map((checkpoint, index, array) => {
            let latLng: LatLng = L.latLng(checkpoint.attributes.coordinate.y, checkpoint.attributes.coordinate.x)

            if (checkpoint.id) {
              return (
                <>
                  {
                    checkpointClicked?.id == checkpoint.id
                      ? <Marker
                        key={checkpoint.id}
                        data-key={checkpoint.id}
                        draggable={draggable}
                        icon={(checkpoint.attributes.checkpointType == "BEGIN"
                            ? MarkerColors.greenIconSelected
                            : checkpoint.attributes.checkpointType == "END"
                              ? MarkerColors.redIconSelected :
                              MarkerColors.blueIconSelected
                        )}
                        position={latLng}
                        eventHandlers={{
                          drag: (e) => {
                            let newLatLng: LatLng = e.target.getLatLng()
                            const previousSegments = queryClient.getQueryData<Segment[]>(['segments', parseInt(id)])
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


                              queryClient.setQueryData<Segment[]>(['segments', parseInt(id)], previousSegments)
                            }
                          },
                          dragend: (e) => {
                            const list = array
                            let newLatLng: LatLng = e.target.getLatLng()
                            list[index].attributes.coordinate.x = newLatLng.lng
                            list[index].attributes.coordinate.y = newLatLng.lat

                            queryClient.setQueryData<Checkpoint[]>(['checkpoints', parseInt(id)], list)
                            updateCheckpoint.mutate({
                              id: list[index].id || 0,
                              position: list[index].attributes.coordinate,
                              challengeId: id,
                              checkpointType: list[index].attributes.checkpointType,
                              name: list[index].attributes.name,
                            })
                          },
                          contextmenu: (e) => {
                            handleCheckpointContextMenu(e, checkpoint)
                          },
                          click: (e) => {
                            setCheckpointClicked(checkpoint)
                            handleCheckpointClick(e, checkpoint)
                          },
                        }}
                      />
                      : <Marker
                        position={latLng}
                        icon={(checkpoint.attributes.checkpointType == "BEGIN"
                            ? MarkerColors.greenIcon
                            : checkpoint.attributes.checkpointType == "END"
                              ? MarkerColors.redIcon :
                              MarkerColors.blueIcon
                        )}
                        eventHandlers={{
                          click: (e) => {
                            setCheckpointClicked(checkpoint)
                            handleCheckpointClick(e, checkpoint)
                          },
                          contextmenu: (e) => {
                            handleCheckpointContextMenu(e, checkpoint)
                          }
                        }}
                      />
                  }
                </>
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
        <MenuItem onClick={handleMoveCheckpoint}>Modifier la position du checkpoint</MenuItem>
        <MenuItem onClick={handleDeleteCheckpoint}>Supprimer le checkpoint</MenuItem>
      </Menu>
    </>
  )
}

export default Checkpoints