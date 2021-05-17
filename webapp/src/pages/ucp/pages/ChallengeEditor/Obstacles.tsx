import {Segment} from "../../../../api/entities/Segment";
import useObstacles from "../../../../api/useObstacles";
import {Marker, Popup, useMap} from "react-leaflet";
import {calculateCoordOnPolyline} from "../../../../utils/orthonormalCalculs";
import L, {LeafletEventHandlerFnMap} from "leaflet";
import MarkerColors from "../../components/Leaflet/marker-colors";
import {useEffect, useLayoutEffect, useState} from "react";
import Obstacle from "../../../../api/entities/Obstacle";
import useMapEditor from "../../../../hooks/useMapEditor";
import {Button} from "@material-ui/core";
import UpdateObstacleDialog from "./UpdateObstacleDialog";
import MoveObstacle from "./MoveObstacle";

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
          /* Convertie la position en pourcentage provenant de l'API vers la vraie distance divisé par l'échelle pour
             récupérer la distance du point sur la polyline sur le repère orthonormé
             (car length correspond à la longueur rapporté à l'échelle donné par l'utilisateur)
           */
          const orthonormalDistance = (obstacle.attributes.position * segment.attributes.length)/scale

          console.log(segment.attributes.coordinates)
          console.log(orthonormalDistance)
          const position = calculateCoordOnPolyline(segment.attributes.coordinates, orthonormalDistance)

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
                  eventHandlers={{
                    click() {
                      setSelectedObject(obstacle)
                    }
                  }}
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