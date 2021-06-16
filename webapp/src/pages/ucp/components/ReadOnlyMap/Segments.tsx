import * as React from 'react'
import {useRouter} from "../../../../hooks/useRouter";
import {useSegments} from "../../../../api/segments/useSegments";
import {Polyline, Popup, useMapEvents} from 'react-leaflet';
import L, {LatLng} from "leaflet";
import Obstacles from "./Obstacles";
import useChallenge from "../../../../api/challenges/useChallenge";
import {Paper} from "@material-ui/core";
import {useState} from "react";

interface Props {
  challengeId: number
}

const Segments = (props: Props) => {
  const {
    challengeId,
  } = props

  const challenge = useChallenge(challengeId)
  const segmentList = useSegments(challengeId)

  const [pos, setPos] = useState<string>('0')

  useMapEvents({
    mousemove(e) {
      setPos("lat: " + e.latlng.lat + " - lng: " + e.latlng.lng)
    }
  })

  return (
    <>
      <Paper>{pos}</Paper>
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
              >
                <Popup>
                  {segment.attributes.name} {segment.id} {segment.attributes.length}
                </Popup>
              </Polyline>
            </React.Fragment>
          )
        })
      }
    </>
  )
}

export default Segments