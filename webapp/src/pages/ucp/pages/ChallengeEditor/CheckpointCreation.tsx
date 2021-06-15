import * as React from 'react';
import {Marker, useMap, useMapEvents} from "react-leaflet";
import L, {LatLng, LeafletMouseEvent} from "leaflet";
import {useEffect, useRef, useState} from "react";
import MarkerColors from "../../../../utils/marker-colors";
import {CheckpointType} from "@acrobatt";
import {useCheckpoints} from "../../../../api/checkpoints/useCheckpoints";
import useCreateCheckpoint from "../../../../api/checkpoints/useCreateCheckpoint";
import {useRouter} from "../../../../hooks/useRouter";
import {useSnackbar} from "notistack";
import useMapEditor from "../../../../hooks/useMapEditor";

type Props = {
  onCheckpointPlaced(position: LatLng): void
  checkpointType: CheckpointType
}

const CheckpointCreation = (props: Props) => {
  const {
    checkpointType,
    onCheckpointPlaced
  } = props

  const router = useRouter()
  let challengeId = parseInt(router.query.id)
  const {enqueueSnackbar} = useSnackbar()
  const {bounds} = useMapEditor()

  /***************************
   **  Checkpoint creation  **
   ***************************/
  const [markerIcon, setMarkerIcon] = useState<L.Icon>(MarkerColors.blueIcon)

  useEffect(() => {
    if (checkpointType == "BEGIN") {
      setMarkerIcon(MarkerColors.greenIcon)
    } else if (checkpointType == "END") {
      setMarkerIcon(MarkerColors.redIcon)
    } else {
      setMarkerIcon(MarkerColors.blueIcon)
    }
  }, [checkpointType])

  const checkpointsList = useCheckpoints(challengeId)
  const createCheckpointMutation = useCreateCheckpoint()

  //const [createCheckpointType, setCreateCheckpointType] = useState<CheckpointType | null>(null)
  const [markerPreviewPos, setMarkerPreviewPos] = useState<LatLng | null>(null)

  useMapEvents({
    mousemove(e: LeafletMouseEvent) {
      let latLng = e.latlng

      if (checkpointType) setMarkerPreviewPos(latLng)
    },
    click(e: LeafletMouseEvent) {
      if (markerPreviewPos) {
        let imgBounds = L.latLngBounds(bounds)
        if (imgBounds.contains(markerPreviewPos)) {
          if (checkpointsList.isSuccess) {
            const checkpointData = checkpointsList.data
            if (checkpointData.some(checkpoint => checkpoint.attributes.checkpointType == "BEGIN") && checkpointType == "BEGIN") {
              enqueueSnackbar("Le point de départ existe déjà. vous ne pouvez pas placer plus d'un point de départ", {
                variant: 'warning'
              })

            } else if (checkpointData.some(checkpoint => checkpoint.attributes.checkpointType == "END") && checkpointType == "END") {
              enqueueSnackbar("Le point d'arrivé existe déjà. vous ne pouvez pas placer plus d'un point d'arrivé", {
                variant: 'warning'
              })
            } else {
              createCheckpointMutation.mutate({
                challengeId: challengeId,
                checkpointType: checkpointType,
                segmentStartsIds: [],
                segmentEndIds: [],
                name: "check",
                x: markerPreviewPos.lng,
                y: markerPreviewPos.lat
              }, {
                onError(error) {
                  console.log(error.response?.data)
                  // let errors = error.response?.data.errors
                  // errors?.forEach(error => {
                  //   enqueueSnackbar(error, {
                  //     variant: 'error',
                  //   })
                  // })
                }
              })
            }
          }
        }
        onCheckpointPlaced(markerPreviewPos)
        setMarkerPreviewPos(null)
      }
    },
    contextmenu(e) {
      setMarkerPreviewPos(null)
    }
  })

  return markerPreviewPos && <Marker position={markerPreviewPos} icon={markerIcon}/>
}

export default CheckpointCreation