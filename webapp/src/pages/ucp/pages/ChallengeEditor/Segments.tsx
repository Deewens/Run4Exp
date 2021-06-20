import * as React from 'react'
import {useRouter} from "../../../../hooks/useRouter";
import {useSegments} from "../../../../api/hooks/segments/useSegments";
import {Marker, Polyline, useMap, useMapEvents, CircleMarker, Pane, Popup} from 'react-leaflet';
import L, {LatLng, LatLngExpression, LineUtil} from "leaflet";
import {useEffect, useReducer, useRef, useState} from "react";
import {Segment} from "../../../../api/entities/Segment";
import Obstacles from "./Obstacles";
import Obstacle from "../../../../api/entities/Obstacle";
import useMapEditor from "../../../../hooks/useMapEditor";
import useChallenge from "../../../../api/hooks/challenges/useChallenge";
import {useQueryClient} from "react-query";
import {IPoint} from '@acrobatt';
import useUpdateSegment from "../../../../api/hooks/segments/useUpdateSegment";
import {makeStyles} from "@material-ui/core/styles";
import {Box, Menu, MenuItem, PopoverPosition, TextField, Theme} from "@material-ui/core";
import {Point} from "../../../../api/entities/Point";
import {Checkpoint} from "../../../../api/entities/Checkpoint";
import queryKeys from "../../../../api/queryKeys";
import useDeleteSegment from "../../../../api/hooks/segments/useDeleteSegment";

const useStyles = makeStyles((theme: Theme) => ({}))

type Props = {}

const Segments = (props: Props) => {
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

  const [segmentRightClickMenu, setSegmentRightClickMenu] =
    useState<{ open: boolean, anchorPosition: PopoverPosition, segment: Segment | null }>({
      anchorPosition: {
        top: 0,
        left: 0
      },
      open: false,
      segment: null
    })


  const {mutate: deleteSegment} = useDeleteSegment()

  const handleDeleteSegment = () => {
    deleteSegment(segmentRightClickMenu.segment?.id!)
    // Fermeture du menu
    setSegmentRightClickMenu({open: false, segment: null, anchorPosition: {top: 0, left: 0}})
  }

  useMapEvents({
    mousemove(e) {
      if (draggableCircleMarker) {
        //const segments = queryClient.getQueryData<Segment[]>(['segments', challengeId])
        if (segmentList.isSuccess) {
          let segments = segmentList.data
          let segmentToUpdateIndex = segments.findIndex(segment => segment.id === draggableCircleMarker.segment.id)

          segments[segmentToUpdateIndex].attributes.coordinates[draggableCircleMarker.coordKey] = {
            x: e.latlng.lng,
            y: e.latlng.lat
          }

          queryClient.setQueryData<Segment[]>(['segments', challengeId], segments)
        }
      }
    },
    mouseup(e) {
      if (draggableCircleMarker) {
        const segment = draggableCircleMarker.segment
        setDraggableCircleMarker(null)
        map.dragging.enable()

        updateSegment.mutate({
          id: segment.id!,
          coordinates: segment.attributes.coordinates,
          challengeId: segment.attributes.challengeId,
          checkpointStartId: segment.attributes.checkpointStartId,
          checkpointEndId: segment.attributes.checkpointEndId,
          name: segment.attributes.name,
        }, {
          onSuccess(success) {
          }
        })
      }
    }
  })

  const handleSegmentNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, segmentId: number) => {
    queryClient.setQueryData<Segment[]>([queryKeys.SEGMENTS, challengeId], old => {
      if (old)
        return old.map(value => {
          let returnValue = {...value}
          if (value.id == segmentId) {
            returnValue.attributes.name = e.target.value
          }
          return returnValue
        })
      return old as unknown as Segment[]
    })
  }


  const handleSegmentNameBlur = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, segment: Segment) => {
    updateSegment.mutate({
      id: segment.id!,
      checkpointStartId: segment.attributes.checkpointStartId,
      checkpointEndId: segment.attributes.checkpointEndId,
      name: e.target.value,
      challengeId: segment.attributes.challengeId,
      coordinates: segment.attributes.coordinates,
    })
  }


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
                    L.DomEvent.stopPropagation(e);
                  },
                  contextmenu(e) {
                    setSelectedObject(segment)
                    setSegmentRightClickMenu({
                      open: true,
                      segment: segment,
                      anchorPosition: {top: e.originalEvent.clientY, left: e.originalEvent.clientX}
                    })
                  }
                }}
              />
              {
                selectedObject instanceof Segment &&
                selectedObject.id == segment.id && (
                  <>
                    <Polyline
                      weight={6}
                      stroke
                      fillOpacity={0}
                      fillColor="transparent"
                      color="#E3C945"
                      positions={coords}
                      eventHandlers={{
                        contextmenu(e) {
                          setSegmentRightClickMenu({
                            open: true,
                            segment: segment,
                            anchorPosition: {top: e.originalEvent.clientY, left: e.originalEvent.clientX}
                          })
                        }
                      }}
                    >
                      <Box
                        component={Popup}
                        sx={{width: 200,}}
                      >
                        <TextField
                          disabled={challenge.isSuccess && challenge.data.attributes.published}
                          variant="standard"
                          value={segment.attributes.name}
                          onChange={e => handleSegmentNameChange(e, segment.id!)}
                          onBlur={e => handleSegmentNameBlur(e, segment)}
                        />
                        {"Longueur : " + Math.floor(segment.attributes.length) + "m"}
                      </Box>
                    </Polyline>
                    {coords.map((coord, coordKey, arr) => {
                      if (coordKey !== 0 && coordKey !== arr.length - 1 && !challenge.data?.attributes.published) {
                        return (
                          <CircleMarker
                            key={coordKey + segmentKey}
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
                    })}
                  </>
                )}
            </React.Fragment>
          )
        })
      }

      <Menu
        anchorReference="anchorPosition"
        anchorPosition={segmentRightClickMenu.anchorPosition}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        id="simple-menu"
        open={segmentRightClickMenu.open}
        onClose={() => setSegmentRightClickMenu({open: false, segment: null, anchorPosition: {left: 0, top: 0}})}
      >
        <MenuItem onClick={handleDeleteSegment}>Supprimer l'obstacle</MenuItem>
      </Menu>
    </>
  )
}

export default Segments