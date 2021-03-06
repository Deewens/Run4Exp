import * as React from 'react';
import L, {LatLng, LatLngExpression, LeafletMouseEvent} from "leaflet";
import {Marker, Polyline, useMapEvents} from 'react-leaflet';
import {Checkpoint, useCheckpoints} from "../../api/useCheckpoints";
import {useRouter} from "../../hooks/useRouter";
import {useEffect, useState} from "react";
import {Point} from "@acrobatt";
import useCreateSegment from "../../api/useCreateSegment";
import {calculateDistanceBetweenCheckpoint} from "../../utils/orthonormalCalculs";
import {Menu, MenuItem, PopoverPosition} from "@material-ui/core";
import RedIcon from '../../images/markers/marker-icon-2x-green.png'
import GreenIcon from '../../images/markers/marker-icon-red.png'
import BlueIcon from '../../images/markers/marker-icon-2x-blue.png'
import MarkerShadow from '../../images/markers/marker-shadow.png'

let redIcon = new L.Icon({
  iconUrl: RedIcon,
  shadowUrl: MarkerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

let greenIcon = new L.Icon({
  iconUrl: GreenIcon,
  shadowUrl: MarkerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var blueIcon = new L.Icon({
  iconUrl: BlueIcon,
  shadowUrl: MarkerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type Props = {
  onCheckpointClick(e: LeafletMouseEvent, checkpoint: Checkpoint): void
}

const Checkpoints = ({onCheckpointClick}: Props) => {
  const router = useRouter()
  // @ts-ignore
  let {id} = router.query;

  const checkpointsList = useCheckpoints(id);

  const createSegmentMutation = useCreateSegment()

  const [checkpointStart, setCheckpointStart] = useState<Checkpoint | null>(null)
  const [polyline, setPolyline] = useState<LatLngExpression[]>([]);

  const [isCreateSegmentClicked, setIsCreateSegmentClicked] = useState(false)
  const [checkpointClicked, setCheckpointClicked] = useState<{ e: LeafletMouseEvent, checkpoint: Checkpoint } | null>(null)

  const [openMenu, setOpenMenu] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<PopoverPosition>({top: 0, left: 0});

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

        createSegmentMutation.mutate({
          name: "Segment",
          coordinates: coords,
          length,
          endpointStartId: checkpointStart.id,
          endpointEndId: checkpoint.id,
          challengeId: id
        }, {
          onSuccess: (data) => {
            setPolyline([])
            setIsCreateSegmentClicked(false)
            setCheckpointClicked(null)
          }
        })
      }
    } else {
      let x = e.originalEvent.clientX
      let y = e.originalEvent.clientY
      setAnchorPosition({top: y, left: x})
      setOpenMenu(true)
      setCheckpointClicked({e, checkpoint})
    }
  }

  const handleSetStartPoint = () => {

  }

  const handleSetEndPoint = () => {

  }

  return (
    <>
      {
        checkpointsList.isSuccess && (
          checkpointsList.data._embedded?.checkpointResponseModelList.map(checkpoint => {
            let latLng: LatLng = L.latLng(checkpoint.x, checkpoint.y)



            return (
              <Marker
                position={latLng}
                icon={(checkpoint.checkpointType == "START"
                  ? greenIcon
                  : checkpoint.checkpointType == "END"
                    ? redIcon :
                    blueIcon
                )}
                eventHandlers={{
                  click: (e) => {
                    handleCheckpointClick(e, checkpoint)
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
        <MenuItem onClick={handleSetStartPoint}>Assigner comme point de départ</MenuItem>
        <MenuItem onClick={handleSetEndPoint}>Assigner comme point d'arrivé</MenuItem>
        <MenuItem onClick={() => setOpenMenu(false)}>Supprimer le checkpoint</MenuItem>
      </Menu>
    </>
  )
}

export default Checkpoints