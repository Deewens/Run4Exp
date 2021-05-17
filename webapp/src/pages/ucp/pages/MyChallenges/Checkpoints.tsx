import L, {LatLng} from "leaflet";
import {useCheckpoints} from "../../../../api/useCheckpoints";
import MarkerColors from "../../components/Leaflet/marker-colors";
import * as React from "react";
import {Marker} from "react-leaflet";
import {useRouter} from "../../../../hooks/useRouter";

const Checkpoints = () => {
  const router = useRouter()
  let challengeId = parseInt(router.query.id)
  const checkpointsList = useCheckpoints(1)

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
                    />
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