import * as React from 'react'
import {useRouter} from "../../hooks/useRouter";
import {useCheckpoints} from "../../api/useCheckpoints";
import {useSegments} from "../../api/useSegments";
import { Polyline } from 'react-leaflet';
import L, {LatLng, LatLngExpression} from "leaflet";

const Segments = () => {
  const router = useRouter()
  // @ts-ignore
  let {id} = router.query;

  const segmentList = useSegments(id);

  return (
    <>
      {segmentList.isSuccess &&
        segmentList.data.map(segment => {
          let coords: LatLng[] = segment.coordinates.map((coord) => {
            return L.latLng(coord.y, coord.x);
          });

          return (
            <Polyline positions={coords}/>
          )
        })
      }
    </>
  )
}

export default Segments