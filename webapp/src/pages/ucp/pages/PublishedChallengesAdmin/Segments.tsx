import * as React from 'react'
import {useRouter} from "../../../../hooks/useRouter";
import {useSegments} from "../../../../api/useSegments";
import {Polyline} from 'react-leaflet';
import L, {LatLng} from "leaflet";
import Obstacles from "./Obstacles";
import useChallenge from "../../../../api/useChallenge";

const Segments = () => {
  const router = useRouter()
  let challengeId = parseInt(router.query.id)

  const challenge = useChallenge(1)
  const segmentList = useSegments(1)

  return (
    <>
      {/* SEGMENTS */
        segmentList.isSuccess &&
        segmentList.data.map(segment => {
          let coords: LatLng[] = segment.attributes.coordinates.map((coord) => {
            return L.latLng(coord.y, coord.x);
          });

          return (
            <React.Fragment key={segment.id}>
              <Obstacles
                segment={segment}
                scale={challenge.isSuccess ? challenge.data.attributes.scale : 0}
              />
              <Polyline
                weight={5}
                bubblingMouseEvents={false}
                positions={coords}
              />
            </React.Fragment>
          )
        })
      }
    </>
  )
}

export default Segments