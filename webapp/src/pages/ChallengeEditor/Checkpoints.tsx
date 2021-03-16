import * as React from 'react';
import L, {LatLng, LatLngExpression, LeafletMouseEvent} from "leaflet";
import {Marker, Polyline, useMapEvents} from 'react-leaflet';
import {CheckpointsApi as CheckpointsType, useCheckpoints} from "../../api/useCheckpoints";
import {useRouter} from "../../hooks/useRouter";
import {useEffect, useMemo, useState} from "react";
import {Point} from "@acrobatt";
import useCreateSegment from "../../api/useCreateSegment";
import {calculateDistanceBetweenCheckpoint} from "../../utils/orthonormalCalculs";
import {Menu, MenuItem, PopoverPosition} from "@material-ui/core";
import MarkerColors from "../Leaflet/marker-colors";
import {useQueryClient} from "react-query";
import {SegmentApi} from "../../api/useSegments";
import {Segment} from "../../api/entities/Segment";
import {Checkpoint} from "../../api/entities/Checkpoint";

type Props = {
  onCheckpointClick(e: LeafletMouseEvent, checkpoint: Checkpoint): void
}

const Checkpoints = ({onCheckpointClick}: Props) => {
  const router = useRouter()
  // @ts-ignore
  let {id} = router.query;

  const queryClient = useQueryClient()

  const checkpointsList = useCheckpoints(id);

  const createSegmentMutation = useCreateSegment()

  const [checkpointStart, setCheckpointStart] = useState<Checkpoint | null>(null)
  const [polyline, setPolyline] = useState<LatLngExpression[]>([]);

  const [isCreateSegmentClicked, setIsCreateSegmentClicked] = useState(false)
  const [checkpointClicked, setCheckpointClicked] = useState<{ e: LeafletMouseEvent, checkpoint: Checkpoint } | null>(null)

  const [openMenu, setOpenMenu] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<PopoverPosition>({top: 0, left: 0});

  const [draggable, setDraggable] = useState(false)

  const handleCreateSegment = () => {
    if (checkpointClicked) {
      setIsCreateSegmentClicked(true)
      setOpenMenu(false)

      setPolyline([checkpointClicked.e.latlng, checkpointClicked.e.latlng])
      setCheckpointStart(checkpointClicked.checkpoint)
    }
  }

  useEffect(() => {
    console.log("Polyline index: " + (polyline.length - 1))
  }, [polyline.length])

  useMapEvents({
    click(e) {
      if (polyline.length > 0) {
        console.log("map pos:" + e.latlng)
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
    console.log("checkpoint pos:" + e.latlng)

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
            endpointStartId: checkpointStart.id,
            endpointEndId: checkpoint.id,
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
    } else {
      let x = e.originalEvent.clientX
      let y = e.originalEvent.clientY
      setAnchorPosition({top: y, left: x})
      setOpenMenu(true)
      setCheckpointClicked({e, checkpoint})
    }
  }


  const handleMoveCheckpoint = () => {
    setDraggable(prevState => !prevState)
    setOpenMenu(false)
  }

  return (
    <>
      {
        checkpointsList.isSuccess && (
          checkpointsList.data.map((checkpoint, index, array) => {
            let latLng: LatLng = L.latLng(checkpoint.attributes.coordinate.x, checkpoint.attributes.coordinate.y)


            return (
              <Marker
                draggable={draggable}
                position={latLng}
                icon={(checkpoint.attributes.checkpointType == "BEGIN"
                  ? MarkerColors.greenIcon
                  : checkpoint.attributes.checkpointType == "END"
                    ? MarkerColors.redIcon :
                    MarkerColors.blueIcon
                )}
                eventHandlers={{
                  click: (e) => {
                    handleCheckpointClick(e, checkpoint)
                  },
                  drag: (e) => {
                    let newLatLng: LatLng = e.target.getLatLng()
                    const previousSegments = queryClient.getQueryData<Segment[]>(['segments', id])
                    if (previousSegments) {

                      let segmentStartsIds = checkpoint.attributes.segmentsStartsIds
                      let segmentEndsIds = checkpoint.attributes.segmentsEndsIds
                      // console.log(previousSegments)
                      // console.log(segmentStartsIds)

                      segmentStartsIds.forEach(segmentId => {
                        let segmentStart = previousSegments.find(segment => segment.id == segmentId)

                        if (segmentStart) {
                          segmentStart.attributes.coordinates[0] = {
                            x: newLatLng.lng,
                            y: newLatLng.lat
                          }
                          previousSegments[segmentId] = segmentStart
                        }
                      })

                      segmentEndsIds.forEach(segmentId => {
                        let segmentEnd = previousSegments.find(segment => segment.id == segmentId)

                        if (segmentEnd) {
                          segmentEnd.attributes.coordinates[segmentEnd.attributes.coordinates.length - 1] = {x: newLatLng.lng, y: newLatLng.lat}
                          previousSegments[segmentId] = segmentEnd
                        }
                      })


                      queryClient.setQueryData<Segment[]>(['segments', id], previousSegments)
                    }
                  },
                  dragend: (e) => {
                    const list = array
                    let newLatLng: LatLng = e.target.getLatLng()
                    list[index].attributes.coordinate.x = newLatLng.lat
                    list[index].attributes.coordinate.y = newLatLng.lng


                    queryClient.setQueryData<Checkpoint[]>(['checkpoints', id], list)
                  }
                }}
              />
            )
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
        <MenuItem onClick={() => setOpenMenu(false)}>Supprimer le checkpoint</MenuItem>
      </Menu>
    </>
  )
}

export default Checkpoints