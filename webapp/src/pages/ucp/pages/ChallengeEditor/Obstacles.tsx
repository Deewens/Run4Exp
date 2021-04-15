import {Segment} from "../../../../api/entities/Segment";
import {useObstacles} from "../../../../api/useObstacles";
import {Marker} from "react-leaflet";
import {calculatePointCoordOnSegment} from "../../../../utils/orthonormalCalculs";
import L from "leaflet";

type Props = {
  segment: Segment
  scale: number
}

export default function Obstacles(props: Props) {
  const {
    segment,
    scale
  } = props

  const obstacles = useObstacles(segment.id!)

  return (
    <>
      {
        obstacles.isSuccess &&
        obstacles.data.map(obstacle => {
          const position = calculatePointCoordOnSegment(segment, obstacle.attributes.position, scale)
          if (position) {
            let latLng = L.latLng(position.y, position.x)
            return (
              <Marker
                position={latLng}
              />
            )
          }
        })
      }
    </>
  )
}