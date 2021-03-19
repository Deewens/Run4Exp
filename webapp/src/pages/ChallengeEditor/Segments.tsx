import * as React from 'react'
import {useRouter} from "../../hooks/useRouter";
import {useCheckpoints} from "../../api/useCheckpoints";
import {useSegments} from "../../api/useSegments";
import {Marker, Polyline} from 'react-leaflet';
import L, {LatLng, LatLngExpression} from "leaflet";
import {calculateDistanceOnSegment} from "../../utils/orthonormalCalculs";
import {useState} from "react";

const Segments = () => {
  const router = useRouter()
  // @ts-ignore
  let {id} = router.query;

  const segmentList = useSegments(id)
  const [markerPos, setMarkerPos] = useState<LatLng>(L.latLng(0, 0));

  return (
    <>
      {segmentList.isSuccess &&
        segmentList.data.map(segment => {
          let coords: LatLng[] = segment.attributes.coordinates.map((coord) => {
            return L.latLng(coord.y, coord.x);
          });

          return (
            <Polyline
              positions={coords}
              eventHandlers={{
                click(e) {
                  let res = calculateDistanceOnSegment(segment, 0.60)
                  if (res) setMarkerPos(L.latLng(res.y, res.x))
                  console.log(`res: ${res}`)
                  console.log(`markerPos: ${markerPos}`)
                }
              }}
            />
          )
        })
      }
      <Marker
        position={markerPos}
      />
    </>
  )
}

export default Segments