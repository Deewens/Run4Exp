import * as React from 'react';
import L, {LatLng} from "leaflet";
import {Marker} from 'react-leaflet';
import {Checkpoint} from "@acrobatt";

type Props = {
  checkpoints: Checkpoint[]
  onCheckpointDelete(checkpoint: Checkpoint): void
}

const Checkpoints = ({checkpoints, onCheckpointDelete}: Props) => {
  return (
    <>
      {checkpoints.map((checkpoint) => {
        let latLng: LatLng = L.latLng(checkpoint.position.x, checkpoint.position.y);

        return <Marker
          position={latLng}
          eventHandlers={{
            click: () => {
              onCheckpointDelete(checkpoint)
            }
          }}
        />
      })}
    </>
  )
}

export default Checkpoints