import {Segment} from "../../../../api/entities/Segment";
import useObstacles from "../../../../api/obstacles/useObstacles";
import {Marker, Popup} from "react-leaflet";
import {calculateCoordOnPolyline} from "../../../../utils/orthonormalCalculs";
import MarkerColors from "../../../../utils/marker-colors";
import L from "leaflet";

type Props = {
  segment: Segment
  scale: number
}

export default function Obstacles(props: Props) {
  const {
    segment,
    scale,
  } = props

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
          const orthonormalDistance = (obstacle.attributes.position * segment.attributes.length) / scale
          const position = calculateCoordOnPolyline(segment.attributes.coordinates, orthonormalDistance)

          if (position) {
            let latLng = L.latLng(position.y, position.x)
            return (
              <Marker
                key={obstacle.id}
                data-obstacle={obstacle}
                icon={MarkerColors.orangeIcon}
                position={latLng}
              >
                <Popup>
                  <p>Énigme : {obstacle.attributes.riddle}</p>
                </Popup>
              </Marker>
            )
          }
        })
      }
    </>
  )
}