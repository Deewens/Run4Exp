import {Segment} from "../../../../api/entities/Segment";
import useObstacles from "../../../../api/useObstacles";
import {Marker} from "react-leaflet";
import {calculatePointCoordOnSegment} from "../../../../utils/orthonormalCalculs";
import L, {LeafletEventHandlerFnMap} from "leaflet";
import MarkerColors from "../../components/Leaflet/marker-colors";
import {useEffect} from "react";
import {Obstacle} from "../../../../api/entities/Obstacle";

type Props = {
  segment: Segment
  scale: number
  eventHandlers?: LeafletEventHandlerFnMap
  selectedObstacle: Obstacle | null
}

export default function Obstacles(props: Props) {
  const {
    segment,
    scale,
    eventHandlers,
    selectedObstacle
  } = props

  const obstacles = useObstacles(segment.id!)

  return (
    <>
      {
        obstacles.isSuccess &&
        obstacles.data.map(obstacle => {
          const percentage = obstacle.attributes.position*segment.attributes.length
          const position = calculatePointCoordOnSegment(segment, percentage, scale)
          if (position) {
            let latLng = L.latLng(position.y, position.x)
            if (selectedObstacle?.id === obstacle.id) {
              return (
                <Marker
                  key={obstacle.id}
                  data-obstacle={obstacle}
                  icon={MarkerColors.yellowIcon}
                  position={latLng}
                  eventHandlers={eventHandlers}
                />
              )
            } else {
              return (
                <Marker
                  key={obstacle.id}
                  data-obstacle={obstacle}
                  icon={MarkerColors.orangeIcon}
                  position={latLng}
                  eventHandlers={eventHandlers}
                />
              )
            }
          }
        })
      }
    </>
  )
}