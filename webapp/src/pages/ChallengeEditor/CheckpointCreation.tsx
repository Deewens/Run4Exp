import * as React from 'react';
import {Marker, useMapEvents} from "react-leaflet";
import {LatLng, LeafletMouseEvent} from "leaflet";
import {useState} from "react";

type Props = {
  onCheckpointPlaced(position: LatLng): void
}

const CheckpointCreation = ({onCheckpointPlaced}: Props) => {
  const [hintMarker, setHintMarker] = useState<LatLng | null>(null)

  const map = useMapEvents({
    mousemove(e: LeafletMouseEvent) {
      let latLng = e.latlng;

      setHintMarker(latLng);
    },
    click(e: LeafletMouseEvent) {
      if (hintMarker) onCheckpointPlaced(hintMarker);
    }
  })

  return hintMarker && <Marker position={hintMarker} />
}

export default CheckpointCreation