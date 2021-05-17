import * as React from 'react'
import useCreateSegment from "../../../../api/useCreateSegment";
import useCreateCheckpoint from "../../../../api/useCreateCheckpoint";
import {Marker, Polyline, useMapEvents} from "react-leaflet";
import {useRouter} from "../../../../hooks/useRouter";
import {useState} from "react";
import L, {LatLng, LatLngExpression} from 'leaflet';
import {Menu, MenuItem, PopoverPosition} from "@material-ui/core";
import {Point} from "@acrobatt";
import {calculateDistanceBetweenCheckpoint, calculateDistanceBetweenPoint} from "../../../../utils/orthonormalCalculs";

type Props = {
  onSegmentCreated(): void
  onSegmentCreationCancelled(): void
}

export default function SegmentCreation(props: Props) {
  const {
    onSegmentCreated,
    onSegmentCreationCancelled
  } = props
  const createSegment = useCreateSegment()
  const createCheckpoint = useCreateCheckpoint()
  const router = useRouter()
  const challengeId = parseInt(router.query.id)

  const [markerPreviewPos, setMarkerPreviewPos] = useState<L.LatLng | null>(null)
  const [startMarkerPlaced, setStartMarkerPlaced] = useState(false)
  const [drawSegment, setDrawSegment] = useState(false)
  const [segmentPreviewPos, setSegmentPreviewPos] = useState<LatLngExpression[]>([])

  const [anchorPosition, setAnchorPosition] = useState<PopoverPosition>({top: 0, left: 0})
  const [openMenu, setOpenMenu] = useState(false)

  useMapEvents({
    click(e) {
      if (!startMarkerPlaced) {
        setStartMarkerPlaced(true)
        setSegmentPreviewPos([e.latlng, e.latlng])

      } else {
        if (segmentPreviewPos.length > 0) {
          setSegmentPreviewPos(prevState => [...prevState, e.latlng])
        }
      }
    },
    mousemove(e) {
      if (startMarkerPlaced) {
        let updatedPolylineArray = [...segmentPreviewPos]
        updatedPolylineArray[segmentPreviewPos.length - 1] = e.latlng
        setSegmentPreviewPos(updatedPolylineArray)
      } else {
        setMarkerPreviewPos(e.latlng)
      }
    },
    contextmenu(e) {
      setOpenMenu(true)
      let x = e.originalEvent.clientX
      let y = e.originalEvent.clientY
      setAnchorPosition({top: y, left: x})
    }
  })

  const handleCreateSegment = () => {
    let endLatLng = L.latLng(segmentPreviewPos[segmentPreviewPos.length - 1])
    setOpenMenu(false)

    if (markerPreviewPos) {
      createCheckpoint.mutate({
        checkpointType: "MIDDLE",
        challengeId: challengeId,
        x: markerPreviewPos.lng,
        y: markerPreviewPos.lat,
        name: "No name",
        segmentStartsIds: [],
        segmentEndIds: [],
      }, {
        onSuccess(startCheckpoint) {
          createCheckpoint.mutate({
            checkpointType: "MIDDLE",
            challengeId: challengeId,
            x: endLatLng.lng,
            y: endLatLng.lat,
            name: "No name",
            segmentStartsIds: [],
            segmentEndIds: [],
          }, {
            onSuccess(endCheckpoint) {
              const coords: Point[] = segmentPreviewPos.map((value) => {
                let pos = L.latLng(value)
                return {x: pos.lng, y: pos.lat}
              })

              const length = calculateDistanceBetweenCheckpoint(coords, 100)

              createSegment.mutate({
                checkpointStartId: startCheckpoint.id!,
                checkpointEndId: endCheckpoint.id!,
                challengeId: challengeId,
                length: length,
                name: "No name",
                coordinates: coords,
              }, {
                onSuccess() {
                  onSegmentCreated()
                }
              })
            }
          })
        }
      })
    }
  }

  const handleCancel = () => {
    setOpenMenu(false)
    onSegmentCreationCancelled()
  }

  return (
    <>
      {markerPreviewPos && <Marker position={markerPreviewPos} />}
      {segmentPreviewPos.length > 0 && <Polyline positions={segmentPreviewPos} />}

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
        <MenuItem onClick={handleCreateSegment}>Terminer le segment</MenuItem>
        <MenuItem onClick={handleCancel}>Annuler</MenuItem>
      </Menu>
    </>
  )
}