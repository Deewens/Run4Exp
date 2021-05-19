import * as React from 'react'
import {useRouter} from "../../../../hooks/useRouter";
import {useSegments} from "../../../../api/useSegments";
import {Marker, Polyline, useMap, useMapEvents, CircleMarker, Pane} from 'react-leaflet';
import L, {LatLng, LatLngExpression, LineUtil} from "leaflet";
import {useEffect, useReducer, useRef, useState} from "react";
import {Segment} from "../../../../api/entities/Segment";
import Obstacles from "./Obstacles";
import Obstacle from "../../../../api/entities/Obstacle";
import useMapEditor from "../../../../hooks/useMapEditor";
import useChallenge from "../../../../api/useChallenge";
import {useQueryClient} from "react-query";
import {Point} from '@acrobatt';
import useUpdateSegment from "../../../../api/useUpdateSegment";
import {makeStyles} from "@material-ui/core/styles";
import {Theme} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({}))

type Props = {}

const Segments = (props: Props) => {
  const {} = props

  const classes = useStyles()

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

  const updateSegment = useUpdateSegment()
  type DraggableCircleMarker = {
    segment: Segment
    segmentKey: number
    coordKey: number
  }

  const [draggableCircleMarker, setDraggableCircleMarker] = useState<DraggableCircleMarker | null>(null)

  useMapEvents({
    mousemove(e) {
      // let x = e.originalEvent.clientX
      // let y = e.originalEvent.clientY
      //
      // if (segmentRef.current) {
      //   let test = segmentRef.current.closestLayerPoint(new L.Point(x, y))
      //   //console.log(map.layerPointToLatLng(test))
      //   setTest(map.layerPointToLatLng(test))
      // }

      if (draggableCircleMarker) {
        if (segmentList.isSuccess) {
          let segments = segmentList.data
          let pointToUpdate = segments[draggableCircleMarker.segmentKey].attributes.coordinates[draggableCircleMarker.coordKey]
          pointToUpdate.x = e.latlng.lng
          pointToUpdate.y = e.latlng.lat
          segments[draggableCircleMarker.segmentKey].attributes.coordinates[draggableCircleMarker.coordKey] = pointToUpdate
          queryClient.setQueryData<Segment[]>(['segments', challengeId], segments)
        }
      }
    },
    mouseup(e) {
      if (draggableCircleMarker) {
        const segment = draggableCircleMarker.segment
        segment.attributes.coordinates[draggableCircleMarker.coordKey].x = e.latlng.lng
        segment.attributes.coordinates[draggableCircleMarker.coordKey].y = e.latlng.lat
        setDraggableCircleMarker(null)

        updateSegment.mutate({
          id: segment.id!,
          coordinates: segment.attributes.coordinates,
          challengeId: segment.attributes.challengeId,
          checkpointEndId: segment.attributes.checkpointEndId,
          checkpointStartId: segment.attributes.checkpointStartId,
          name: segment.attributes.name,
        })
      }
    }
  })


  return (
    <>
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
              {
                coords.map((coord, coordKey, arr) => {
                  if (coordKey !== 0 && coordKey !== arr.length - 1) {
                    return (
                      <CircleMarker
                        key={coordKey}
                        data-test="5"
                        center={coord}
                        radius={4}
                        color="blue"
                        fillOpacity={1}
                        fillColor="white"
                        eventHandlers={{
                          mousedown() {
                            map.dragging.disable()
                            setDraggableCircleMarker({segment, coordKey, segmentKey})
                          }
                        }}
                      />
                    )
                  }
                })

              }
            </React.Fragment>
          )
        })
      }
    </>
  )
}

export default Segments