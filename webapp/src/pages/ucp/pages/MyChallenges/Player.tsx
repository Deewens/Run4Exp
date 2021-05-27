import * as React from 'react'
import useUrlParams from "../../../../hooks/useUrlParams";
import {useUserSession} from "../../../../api/useUserSession";
import {Marker} from 'react-leaflet';
import MarkerColors from "../../components/Leaflet/marker-colors";
import {useSegments} from "../../../../api/useSegments";
import {useRouter} from "../../../../hooks/useRouter";
import useChallenge from "../../../../api/useChallenge";
import {calculateCoordOnPolyline} from "../../../../utils/orthonormalCalculs";
import L from 'leaflet';

export default function Player() {
  const router = useRouter()
  const urlParams = useUrlParams()
  let challengeId = parseInt(router.query.id)

  const challenge = useChallenge(challengeId)
  const segments = useSegments(challengeId)
  const userSession = useUserSession(parseInt(urlParams.get("session")!))

  const getPlayerPosition = () => {
    if (userSession.isSuccess && segments.isSuccess && challenge.isSuccess) {
      let selectedSegment = segments.data.find(x => x.id === userSession.data.attributes.currentSegmentId);

      if (selectedSegment) {
        let roundedDistance = Math.round(((userSession.data.attributes.advancement) / 100) * 100) / challenge.data.attributes.scale;
        let position = calculateCoordOnPolyline(selectedSegment.attributes.coordinates, roundedDistance)

        if (position) return L.latLng(position.y, position.x)
      }
    }

    return L.latLng(0, 0)
  }


  return <Marker icon={MarkerColors.runnerIcon} position={getPlayerPosition()} />

}
