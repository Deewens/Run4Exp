import L, {LatLng} from "leaflet";
import {useCheckpoints} from "../../../../api/hooks/checkpoints/useCheckpoints";
import MarkerColors from "../../../../utils/marker-colors";
import * as React from "react";
import {Marker, Popup} from "react-leaflet";
import {useRouter} from "../../../../hooks/useRouter";

interface Props {
  challengeId: number
}

const Checkpoints = (props: Props) => {
  const {
    challengeId,
  } = props

  const checkpointsList = useCheckpoints(challengeId)

  return (
    <>
      {
        checkpointsList.isSuccess && (
          checkpointsList.data.map((checkpoint, index, array) => {
            let latLng: LatLng = L.latLng(checkpoint.attributes.coordinate.y, checkpoint.attributes.coordinate.x)
            let icon = (checkpoint.attributes.checkpointType == "BEGIN"
              ? MarkerColors.greenIcon
              : checkpoint.attributes.checkpointType == "END"
                ? MarkerColors.redIcon :
                MarkerColors.blueIcon)

            if (checkpoint.id) {
              return (
                <React.Fragment key={checkpoint.id}>
                  {
                    <Marker
                      icon={icon}
                      position={latLng}
                    >
                      <Popup>
                        {checkpoint.attributes.name}
                      </Popup>
                    </Marker>
                  }
                </React.Fragment>
              )
            }
          })
        )
      }
    </>
  )
}

export default Checkpoints