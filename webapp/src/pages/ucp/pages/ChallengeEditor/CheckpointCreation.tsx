import * as React from 'react';
import {Marker, useMapEvents} from "react-leaflet";
import {LatLng, LeafletMouseEvent} from "leaflet";
import {useEffect, useState} from "react";
import MarkerColors from "../../components/Leaflet/marker-colors";
import {CheckpointType} from "@acrobatt";

type Props = {
  onCheckpointPlaced(position: LatLng): void
  checkpointType: CheckpointType
}

const CheckpointCreation = ({onCheckpointPlaced, checkpointType}: Props) => {
  const [hintMarker, setHintMarker] = useState<LatLng | null>(null)
  const [markerIcon, setMarkerIcon] = useState<L.Icon>(MarkerColors.blueIcon)

  useEffect(() => {
    if (checkpointType == "BEGIN") setMarkerIcon(MarkerColors.greenIcon)
    else if (checkpointType == "END") setMarkerIcon(MarkerColors.redIcon)
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