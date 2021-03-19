import * as React from 'react';
import {Marker, useMapEvents} from "react-leaflet";
import {LatLng, LatLngExpression, LeafletMouseEvent} from "leaflet";
import {useEffect, useState} from "react";
import MarkerColors from "../Leaflet/marker-colors";

type Props = {
  onCheckpointPlaced(position: LatLng): void
  checkpointType: 0 | 1 | 2
}

const CheckpointCreation = ({onCheckpointPlaced, checkpointType}: Props) => {
  const [hintMarker, setHintMarker] = useState<LatLng | null>(null)
  const [markerIcon, setMarkerIcon] = useState<L.Icon>(MarkerColors.blueIcon)

  useEffect(() => {
    if (checkpointType == 0) setMarkerIcon(MarkerColors.greenIcon)
    else if (checkpointType == 2) setMarkerIcon(MarkerColors.redIcon)
  }, [checkpointType])

  useMapEvents({
    mousemove(e: LeafletMouseEvent) {
      let latLng = e.latlng

      setHintMarker(latLng)
    },
    click(e: LeafletMouseEvent) {
      if (hintMarker) onCheckpointPlaced(hintMarker)
    }
  })

  return hintMarker && <Marker position={hintMarker} icon={markerIcon}/>
}

export default CheckpointCreation