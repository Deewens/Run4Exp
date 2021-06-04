import * as React from 'react'
import useUrlParams from "../../../../hooks/useUrlParams";
import {useUserSession} from "../../../../api/useUserSession";
import {Marker, Popup} from 'react-leaflet';
import MarkerColors from "../../../../utils/marker-colors";
import {useSegments} from "../../../../api/useSegments";
import {useRouter} from "../../../../hooks/useRouter";
import useChallenge from "../../../../api/useChallenge";
import {calculateCoordOnPolyline} from "../../../../utils/orthonormalCalculs";
import L from 'leaflet';
import useUser from "../../../../api/useUser";

type Props = {
  userSessionId: number
  userId: number
}

export default function Player(props: Props) {
  const {
    userSessionId,
    userId,
  } = props

  const router = useRouter()
  let challengeId = parseInt(router.query.id)
  const challenge = useChallenge(challengeId)
  const segments = useSegments(challengeId)

  const userSession = useUserSession(userSessionId)
  const user = useUser(userId)

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


  return (
    <Marker icon={MarkerColors.runnerIcon} position={getPlayerPosition()}>
      <Popup>
        {user.isSuccess && user.data.firstName + " " + user.data.name}
      </Popup>
    </Marker>
  )

}
