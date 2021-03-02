import * as React from 'react';
import L, {LatLng, LatLngExpression, LeafletMouseEvent} from "leaflet";
import {Marker, Polyline, useMapEvents} from 'react-leaflet';
import {Checkpoint, useCheckpoints} from "../../api/useCheckpoints";
import {useRouter} from "../../hooks/useRouter";
import {useState} from "react";
import {Point} from "@acrobatt";
import useCreateSegment from "../../api/useCreateSegment";

type Props = {
  onCheckpointClick(e: LeafletMouseEvent, checkpoint: Checkpoint): void
}

const Checkpoints = ({onCheckpointClick}: Props) => {
  const router = useRouter()
  // @ts-ignore
  let {id} = router.query;

  const checkpointsList = useCheckpoints(id);

  const createSegmentMutation = useCreateSegment()

  const [checkpointStart, setCheckpointStart] = useState<Checkpoint | null>(null)
  const [isDrawingPolyline, setIsDrawingPolyline] = useState(false)
  const [polyline, setPolyline] = useState<LatLngExpression[]>([]);
  const [lineIndex, setLineIndex] = useState(0);

  useMapEvents({
    click(e) {
      console.log("click on map")
      if (isDrawingPolyline) {
        let latLng = e.latlng


        if (polyline.length > 0) {
          setPolyline(prevState => [...prevState, latLng]);
        }
        setLineIndex(prevState => prevState + 1);
        //setIsDrawingPolyline(true);
      }
    },
    mousemove(e) {
      let latLng = e.latlng

      if (isDrawingPolyline) {
        let arr = [...polyline]
        arr[lineIndex] = latLng

        setPolyline(arr)
      }
    }
  })

  const handleCheckpointClick = (e: LeafletMouseEvent, checkpoint: Checkpoint) => {
    console.log("checkpoint pos:" + e.latlng)
    console.log("click on marker")

    if (isDrawingPolyline && checkpointStart) {
      setIsDrawingPolyline(false)


      let coords: Point[] = polyline.map((value) => {
        //@ts-ignore
        return {x: value.lng, y: value.lat};
      });

      console.log(checkpoint)
      coords.push({y: checkpoint.x, x: checkpoint.y})


      createSegmentMutation.mutate(
        {
          name: "yo",
          coordinates: coords,
          challengeId: id,
          endpointEndId: checkpoint.id,
          endpointStartId: checkpointStart.id,
          length: 100,
        },
        {
          onSuccess: (data, variables, context) => {
            //console.log(data)
          }
        }
      )

    } else {
      let latLng = L.latLng(checkpoint.x, checkpoint.y)
      setPolyline([latLng, latLng])
      setCheckpointStart(checkpoint)
      setIsDrawingPolyline(true);
      setLineIndex(prevState => prevState + 1);
    }

  }

  return (
    <>
      {
        checkpointsList.data && (
          checkpointsList.data._embedded?.checkpointResponseModelList.map(checkpoint => {
            let latLng: LatLng = L.latLng(checkpoint.x, checkpoint.y)



            return <Marker
              position={latLng}
              eventHandlers={{
                click: (e) => {
                  handleCheckpointClick(e, checkpoint)
                }
              }}
            />
          })
        )
      }
      {isDrawingPolyline &&
        <Polyline
          positions={polyline}
        />
      }
    </>
  )
}

export default Checkpoints