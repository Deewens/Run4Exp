import * as React from 'react'
import {useRouter} from "../../../../hooks/useRouter";
import {useSegments} from "../../../../api/useSegments";
import {Marker, Polyline, useMap, useMapEvents, CircleMarker} from 'react-leaflet';
import L, {LatLng, LatLngExpression, LineUtil} from "leaflet";
import {useEffect, useRef, useState} from "react";
import {Segment} from "../../../../api/entities/Segment";
import Obstacles from "./Obstacles";
import Obstacle from "../../../../api/entities/Obstacle";
import useMapEditor from "../../../../hooks/useMapEditor";
import useChallenge from "../../../../api/useChallenge";
import {useQueryClient} from "react-query";
import { Point } from '@acrobatt';

type Props = {
}

const Segments = (props: Props) => {
  const {
  } = props

  const router = useRouter()
  let challengeId = parseInt(router.query.id)
  const map = useMap()

  const challenge = useChallenge(challengeId)
  const {selectedObject, setSelectedObject} = useMapEditor()

  const queryClient = useQueryClient()

  /***********************
   **  Segments Display **
   ***********************/
  const segmentList = useSegments(challengeId)
  const segmentRef = useRef<L.Polyline>(null)
  const [test, setTest] = useState<LatLngExpression>([0, 0])

  useMapEvents({
    mousemove(e) {
      let x = e.originalEvent.clientX
      let y = e.originalEvent.clientY

      if (segmentRef.current) {
        let test = segmentRef.current.closestLayerPoint(new L.Point(x, y))
        //console.log(map.layerPointToLatLng(test))
        setTest(map.layerPointToLatLng(test))
      }
    }
  })

  const [segmentSelected, setSegmentSelected] = useState<number>(-1)
  const [intermediatePointSelected, setIntermediatePointSelected] = useState<number>(-1)

  const dragCircleMarker = (e: L.LeafletMouseEvent) => {

    if (segmentList.isSuccess) {
      let segments = segmentList.data
      if (segmentSelected > -1 && intermediatePointSelected > -1) {
        let pointToUpdate = segments[segmentSelected].attributes.coordinates[intermediatePointSelected]
        pointToUpdate.x = e.latlng.lng
        pointToUpdate.y = e.latlng.lat
        segments[segmentSelected].attributes.coordinates[intermediatePointSelected] = pointToUpdate
        queryClient.setQueryData<Segment[]>(['segments', challengeId], segments)
      }
    }
  }

  return (
    <>
      {/*<CircleMarker*/}
      {/*  center={test}*/}
      {/*/>*/}
      {/* SEGMENTS */
        segmentList.isSuccess &&
        segmentList.data.map((segment, segmentKey) => {
          let coords: LatLng[] = segment.attributes.coordinates.map((coord) => {
            return L.latLng(coord.y, coord.x);
          });

          return (
            <React.Fragment key={segment.id}>
              <Obstacles
                eventHandlers={{
                  click(e) {
                    // let obstacle: Obstacle = e.target.options['data-obstacle']
                    // setSelectedObject(obstacle)
                    //setObstacleDistance(obstacle.attributes.position*100)
                  }
                }}
                segment={segment}
                scale={challenge.isSuccess ? challenge.data.attributes.scale : 0}
              />
              {
                coords.map((coord, coordKey) => {
                  return (
                    <CircleMarker
                      center={coord}
                      radius={6}
                      color="red"
                      fillColor="white"
                      eventHandlers={{
                        click(e) {
                          if (e.latlng.equals(coord)) {

                          }
                        },
                        mousedown(e) {
                          map.dragging.disable()
                          setSegmentSelected(segmentKey)
                          setIntermediatePointSelected(coordKey)
                          map.on('mousemove', dragCircleMarker)
                        },
                        mouseup(e) {
                          map.dragging.enable()
                          setSegmentSelected(-1)
                          setIntermediatePointSelected(-1)
                          map.off('mousemove', dragCircleMarker)
                        },
                      }}
                    />
                  )
                })
              }
              <Polyline
                ref={segmentRef}
                weight={5}
                bubblingMouseEvents={false}
                positions={coords}
                eventHandlers={{
                  click(e) {
                    setSelectedObject(segment)
                    console.log(selectedObject)
                    L.DomEvent.stopPropagation(e);
                  },
                }}
              />
              {
                selectedObject instanceof Segment &&
                selectedObject.id == segment.id &&
                <Polyline
                    weight={6}
                    stroke
                    fillOpacity={0}
                    fillColor="transparent"
                    color="#E3C945"
                    positions={coords}
                />
              }
            </React.Fragment>
          )
        })
      }
    </>
  )
}

export default Segments