import * as React from 'react';
import {Circle, Marker, Polyline, useMapEvent, useMapEvents, Popup} from "react-leaflet";
import L, {
  LatLng,
  LatLngExpression,
  LeafletMouseEvent,
} from "leaflet";
import {SetStateAction, useEffect, useState} from "react";
import {Point, Segment} from "@acrobatt";

type Props = {
  isCreateSegmentClicked: boolean
  setIsCreateSegmentClicked: (value: SetStateAction<boolean>) => void
  segmentList: Segment[]
  setSegmentList: (value: SetStateAction<Segment[]>) => void
  polyline: LatLngExpression[]
  setPolyline: (value: SetStateAction<LatLngExpression[]>) => void
}

const CreateSegment = (props: Props) => {
  const {
    isCreateSegmentClicked,
    setIsCreateSegmentClicked,
    segmentList,
    setSegmentList,
    polyline,
    setPolyline
  } = props;

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isDrawingPolyline, setIsDrawingPolyline] = useState(false);


  const map = useMapEvents({
    click(e: LeafletMouseEvent) {
      if (isCreateSegmentClicked && (segmentList.length === 0 || polyline.length > 0)) {
        let latLng = e.latlng;

        if (polyline.length > 0) {
          setPolyline(prevState => [...prevState, latLng]);
        } else {
          setPolyline([latLng, latLng]);
        }

        setCurrentLineIndex(prevState => prevState + 1);

        setIsDrawingPolyline(true);
      }

      if (isCreateSegmentClicked && segmentList.length > 0) {
        console.log("Vous devez créer le segment à partir d'un point de passage existant.");
      }
    },
    mousemove(e: LeafletMouseEvent) {
      let latLng = e.latlng;

      if (isCreateSegmentClicked && isDrawingPolyline) {

        let arr = [...polyline];
        arr[currentLineIndex] = latLng;

        setPolyline(arr);
      }
    },
    contextmenu(e: LeafletMouseEvent) {
      if (isCreateSegmentClicked && isDrawingPolyline) {
        setIsDrawingPolyline(false);
        setIsCreateSegmentClicked(false);

        let startLatLng = polyline[0];
        let endLatLng = polyline[polyline.length - 2];

        console.log(endLatLng);

        //@ts-ignore
        let startPoint = {x: startLatLng.lng, y: startLatLng.lat};
        //@ts-ignore
        let endPoint = {x: endLatLng.lng, y: endLatLng.lat};

        let polylineCoords = polyline.slice(1, polyline.length - 1);
        let coords: Point[] = polylineCoords.map((value) => {
          //@ts-ignore
          return {x: value.lng, y: value.lat};
        })

        setSegmentList(
          prevState => [...prevState, {
            start: startPoint,
            end: endPoint,
            coords: coords
          }]
        );

        setPolyline([]);
        setCurrentLineIndex(0);

      }
    }
  });

  const handleCheckpointClick = (e: LeafletMouseEvent, center: LatLng) => {
    if (isCreateSegmentClicked) {
      //let latLng = e.latlng;

      if (polyline.length > 0) {
        setPolyline(prevState => [...prevState, center]);
      } else {
        setPolyline([center, center]);
      }

      setCurrentLineIndex(prevState => prevState + 1);

      setIsDrawingPolyline(true);
    }
  }

  return (
    <>
      {polyline && <Polyline positions={polyline}/>}
      {
        segmentList.map((segment, index, array) => {
          if (segment.start && segment.end) {
            let latLngStart = L.latLng(segment.start.y, segment.start.x);
            let latLngEnd = L.latLng(segment.end.y, segment.end.x);

            let marker = (
              <>
                <Marker
                  position={latLngStart}
                  eventHandlers={{
                    click: (e) => handleCheckpointClick(e, latLngStart)
                  }}
                >
                  <Popup>Départ</Popup>
                </Marker>
                <Marker
                  position={latLngEnd}
                  eventHandlers={{
                    click: (e) => handleCheckpointClick(e, latLngEnd)
                  }}
                >
                  <Popup>Arrivé</Popup>
                </Marker>
              </>
            );

            for (let i = 0; i<array.length; i++) {
              if (segment.start.y === array[i].end?.y && segment.start.x === array[i].end?.x) {
                console.log("Is it true?");
                marker = (
                  <>
                    <Marker
                      position={latLngStart}
                      eventHandlers={{
                        click: (e) => handleCheckpointClick(e, latLngStart)
                      }}
                    >
                      <Popup>Départ et arrivé</Popup>
                    </Marker>
                    <Marker
                      position={latLngEnd}
                      eventHandlers={{
                        click: (e) => handleCheckpointClick(e, latLngEnd)
                      }}
                    >
                      <Popup>Arrivé</Popup>
                    </Marker>
                  </>
                );
              }

              if (segment.end.y === array[i].start?.y && segment.end.x === array[i].start?.x) {
                marker = (
                  <>
                    <Marker
                      position={latLngEnd}
                      eventHandlers={{
                        click: (e) => handleCheckpointClick(e, latLngEnd)
                      }}
                    >
                      <Popup>Arrivé et départ</Popup>
                    </Marker>
                    <Marker
                      position={latLngStart}
                      eventHandlers={{
                        click: (e) => handleCheckpointClick(e, latLngStart)
                      }}
                    >
                      <Popup>Départ</Popup>
                    </Marker>
                  </>
                );
              }
            }

            return marker;
          }
        })
      }
    </>
  );
};

export default CreateSegment;