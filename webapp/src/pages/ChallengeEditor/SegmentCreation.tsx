import * as React from 'react';
import {useEffect, useState} from "react";
import L, {LatLng, LatLngExpression, LeafletMouseEvent} from "leaflet";
import {Marker, Polyline, useMapEvents} from "react-leaflet";
import {Checkpoint} from "../../api/useCheckpoints";

type Props = {
  checkpoint: Checkpoint | null
}

const SegmentCreation = ({checkpoint}: Props) => {
  const [polyline, setPolyline] = useState<LatLngExpression[]>([]);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (checkpoint) {
      console.log("checkpoint clicked");
      let latLng = L.latLng(checkpoint.x, checkpoint.y)
      setPolyline([latLng, latLng]);

      setLineIndex(prevState => prevState + 1);
    }
  }, [checkpoint])

  const map = useMapEvents({
    click(e: LeafletMouseEvent) {
      let latLng = e.latlng
      if (polyline.length > 0) {
        setPolyline(prevState => [...prevState, latLng])
      }
    },
    mousemove(e: LeafletMouseEvent) {
      if (lineIndex > 0) {
        let latLng = e.latlng;

        let arr = [...polyline];
        arr[lineIndex] = latLng;

        setPolyline(arr);
      }

    },
  })

  return polyline ? <Polyline positions={polyline}/> : null;
}

export default SegmentCreation