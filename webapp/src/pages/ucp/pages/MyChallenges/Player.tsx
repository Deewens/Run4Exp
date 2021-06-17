import * as React from 'react'
import useUrlParams from "../../../../hooks/useUrlParams";
import {useUserSession} from "../../../../api/user_sessions/useUserSession";
import {Marker} from 'react-leaflet';
import MarkerColors from "../../../../utils/marker-colors";
import {useSegments} from "../../../../api/segments/useSegments";
import {useRouter} from "../../../../hooks/useRouter";
import useChallenge from "../../../../api/challenges/useChallenge";
import {calculateCoordOnPolyline} from "../../../../utils/orthonormalCalculs";
import L from 'leaflet';
import {useCheckpoints} from "../../../../api/checkpoints/useCheckpoints";
import {getPlayerPosition} from "../../../../utils/helpers";
import {useEffect, useState} from "react";

export default function Player() {
  const router = useRouter()
  const urlParams = useUrlParams()
  let challengeId = parseInt(router.query.id)

  const challenge = useChallenge(challengeId)
  const checkpoints = useCheckpoints(challengeId)
  const segments = useSegments(challengeId)
  const userSession = useUserSession(parseInt(urlParams.get("session")!))

  const [pos, setPos] = useState<L.LatLng>(L.latLng(0, 0))

  useEffect(() => {
    if (challenge.isSuccess && userSession.isSuccess && segments.isSuccess && checkpoints.isSuccess) {
      setPos(getPlayerPosition(challenge.data, userSession.data, segments.data, checkpoints.data))
    }
  }, [challenge.isSuccess, checkpoints.isSuccess, segments.isSuccess, userSession.isSuccess])

  if (challenge.isSuccess && checkpoints.isSuccess && segments.isSuccess && userSession.isSuccess) {
    return <Marker icon={MarkerColors.runnerIcon} position={pos} />
  }
  return null
}
