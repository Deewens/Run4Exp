import * as React from 'react'
import {useRouter} from "../../hooks/useRouter";
import {useCheckpoints} from "../../api/useCheckpoints";
import {useSegments} from "../../api/useSegments";
import {Marker, Polyline} from 'react-leaflet';
import L, {LatLng, LatLngExpression} from "leaflet";
import {calculatePointCoordOnSegment} from "../../utils/orthonormalCalculs";
import {useEffect, useState} from "react";
import {Slider} from "@material-ui/core";
import {Segment} from "../../api/entities/Segment";

type Props = {
  distanceValue: number
  onClick(segment: Segment): void
}

const Segments = ({distanceValue, onClick}: Props) => {
  const router = useRouter()
  // @ts-ignore
  let {id} = router.query;

  const segmentList = useSegments(parseInt(id))
  const [markerPos, setMarkerPos] = useState<LatLng>(L.latLng(0, 0));
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>()

  useEffect(() => {
    if (selectedSegment) {
      let res = calculatePointCoordOnSegment(selectedSegment, distanceValue, 100)
      if (res) setMarkerPos(L.latLng(res.y, res.x))
      console.log(distanceValue)
    }

  }, [distanceValue])

  return (
    <>
      {segmentList.isSuccess &&
      segmentList.data.map(segment => {
        let coords: LatLng[] = segment.attributes.coordinates.map((coord) => {
          return L.latLng(coord.y, coord.x);
        });

        return (
          <>
            {selectedSegment?.id == segment.id &&
              <Polyline
                weight={7}
                stroke
                color="red"
                positions={coords}
              />
            }
            <Polyline
              weight={5}
              positions={coords}
              eventHandlers={{
                click(e) {
                  setSelectedSegment(segment)
                  onClick(segment)
                }
              }}
            />
          </>
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