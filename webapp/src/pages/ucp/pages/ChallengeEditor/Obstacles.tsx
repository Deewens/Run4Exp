import {Segment} from "../../../../api/entities/Segment";
import useObstacles from "../../../../api/useObstacles";
import {Marker, Popup, useMap} from "react-leaflet";
import {calculatePointCoordOnSegment} from "../../../../utils/orthonormalCalculs";
import L, {LeafletEventHandlerFnMap} from "leaflet";
import MarkerColors from "../../components/Leaflet/marker-colors";
import {useEffect, useLayoutEffect, useState} from "react";
import Obstacle from "../../../../api/entities/Obstacle";
import useMapEditor from "../../../../hooks/useMapEditor";
import {Button} from "@material-ui/core";
import UpdateObstacleDialog from "./UpdateObstacleDialog";

type Props = {
  segment: Segment
  scale: number
  eventHandlers?: LeafletEventHandlerFnMap
}

export default function Obstacles(props: Props) {
  const {
    segment,
    scale,
    eventHandlers,
  } = props

  const editor = useMapEditor()

  const {selectedObject, setSelectedObject} = useMapEditor()
  const [markerColor, setMarkerColor] = useState(MarkerColors.orangeIcon)
  const [openDialog, setOpenDialog] = useState(false)

  const obstacles = useObstacles(segment.id!)

  return (
    <>
      {
        obstacles.isSuccess &&
        obstacles.data.map(obstacle => {
          const percentage = obstacle.attributes.position * segment.attributes.length
          const position = calculatePointCoordOnSegment(segment, percentage, scale)

          if (position) {
            let latLng = L.latLng(position.y, position.x)
            if (selectedObject instanceof Obstacle && selectedObject.id === obstacle.id) {
              return (
                <Marker
                  key={obstacle.id}
                  data-obstacle={obstacle}
                  icon={MarkerColors.yellowIcon}
                  position={latLng}
                  eventHandlers={eventHandlers}
                >
                  <Popup>
                    <p>Enigme : {obstacle.attributes.riddle}</p>
                    <Button fullWidth onClick={() => setOpenDialog(true)}>Editer</Button></Popup>
                </Marker>
              )
            } else {
              return (
                <Marker
                  key={obstacle.id}
                  data-obstacle={obstacle}
                  icon={MarkerColors.orangeIcon}
                  position={latLng}
                  eventHandlers={eventHandlers}
                >
                  <Popup>
                    <p>Enigme : {obstacle.attributes.riddle}</p>
                    <Button fullWidth onClick={() => setOpenDialog(true)}>Editer</Button>
                  </Popup>
                </Marker>
              )
            }
          }
        })
      }
      {selectedObject instanceof Obstacle &&
      <UpdateObstacleDialog
          obstacle={selectedObject}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
      />
      }
    </>
  )
}