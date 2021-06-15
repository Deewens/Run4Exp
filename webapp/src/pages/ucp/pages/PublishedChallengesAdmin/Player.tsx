import * as React from 'react'
import useUrlParams from "../../../../hooks/useUrlParams";
import {useUserSession} from "../../../../api/user_sessions/useUserSession";
import {Marker, Popup} from 'react-leaflet';
import MarkerColors from "../../../../utils/marker-colors";
import {useSegments} from "../../../../api/segments/useSegments";
import {useRouter} from "../../../../hooks/useRouter";
import useChallenge from "../../../../api/challenges/useChallenge";
import {calculateCoordOnPolyline} from "../../../../utils/orthonormalCalculs";
import L from 'leaflet';
import useUser from "../../../../api/user/useUser";
import {getPlayerPosition} from "../../../../utils/helpers";
import {useCheckpoints} from "../../../../api/checkpoints/useCheckpoints";

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
  const checkpoints = useCheckpoints(challengeId)
  const userSession = useUserSession(userSessionId)

  const user = useUser(userId)

  if (challenge.isSuccess && segments.isSuccess && checkpoints.isSuccess && userSession.isSuccess)
  return (
    <Marker icon={MarkerColors.runnerIcon} position={getPlayerPosition(challenge.data, userSession.data, segments.data, checkpoints.data)}>
      <Popup>
        {user.isSuccess && user.data.firstName + " " + user.data.name}
      </Popup>
    </Marker>
  )

  return null

}
