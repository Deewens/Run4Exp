import * as React from 'react';
import {IPoint, Segment} from "@acrobatt";
import {SetStateAction, useEffect, useState} from "react";
import {Polyline, useMapEvents} from "react-leaflet";
import L, {LatLng, LatLngBoundsLiteral, LatLngExpression, LeafletMouseEvent} from "leaflet";

type Props = {
  segmentList: Segment[]
  setSegmentList: (value: SetStateAction<Segment[]>) => void
  imageBounds: LatLngBoundsLiteral
  setAddCheckpoint: (value: SetStateAction<LatLng | null>) => void
  addCheckpoint: LatLng | null
}

const SegmentCreation = (props: Props) => {
  const {
    segmentList,
    setSegmentList,
    imageBounds,
    setAddCheckpoint,
    addCheckpoint
  } = props;

  const [polyline, setPolyline] = useState<LatLngExpression[]>([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [isDrawingPolyline, setIsDrawingPolyline] = useState(false);

  const map = useMapEvents({
    click(e: LeafletMouseEvent) {
      //e.originalEvent.stopPropagation();
      //L.DomEvent.stopPropagation(e);

      let latLng = e.latlng;
      let latLngBounds = L.latLngBounds(imageBounds)

      // Vérifie si le click est effectué sur l'image et non à l'extérieur du repère
      if (latLngBounds.contains(latLng)) {
        if (segmentList.length === 0 || polyline.length > 0) {
          if (polyline.length > 0) {
            setPolyline(prevState => [...prevState, latLng]);
          } else {
            setPolyline([latLng, latLng]);
          }

          setLineIndex(prevState => prevState + 1);
          setIsDrawingPolyline(true);
        }
      }
    },
    mousemove(e: LeafletMouseEvent) {
      let latLng = e.latlng;

      if (isDrawingPolyline) {

        let arr = [...polyline];
        arr[lineIndex] = latLng;

        setPolyline(arr);
      }
    },
    contextmenu(e: LeafletMouseEvent) {
      if (isDrawingPolyline) {
        setIsDrawingPolyline(false);

        let startLatLng = polyline[0];
        let endLatLng = polyline[polyline.length - 2];

        console.log(endLatLng);

        //@ts-ignore
        let startPoint = {x: startLatLng.lng, y: startLatLng.lat};
        //@ts-ignore
        let endPoint = {x: endLatLng.lng, y: endLatLng.lat};

        let polylineCoords = polyline.slice(1, polyline.length - 1);
        let coords: IPoint[] = polylineCoords.map((value) => {
          //@ts-ignore
          return {x: value.lng, y: value.lat};
        });

        setSegmentList(prevState => [...prevState, {
          name: `Segment ${segmentList.length + 1}`,
          start: startPoint,
          end: endPoint,
          coords: coords
        }])

        setPolyline([]);
        setLineIndex(0);
      }
    }
  })

  useEffect(() => {
    if (addCheckpoint) {
      console.log(addCheckpoint);

      if (polyline.length > 0) {
        setPolyline(prevState => [...prevState, addCheckpoint]);
      } else {
        setPolyline([addCheckpoint, addCheckpoint]);
      }

      setLineIndex(prevState => prevState + 1);

      setIsDrawingPolyline(true);
    }
  }, [addCheckpoint])

  return polyline ? <Polyline positions={polyline}/> : null;
}

export default SegmentCreation;