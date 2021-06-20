import * as React from 'react'
import useUrlParams from "../../../../hooks/useUrlParams";
import {useUserSessions} from "../../../../api/hooks/user_sessions/useUserSessions";
import {Marker} from 'react-leaflet';
import MarkerColors from "../../../../utils/marker-colors";
import {useSegments} from "../../../../api/hooks/segments/useSegments";
import {useRouter} from "../../../../hooks/useRouter";
import useChallenge from "../../../../api/hooks/challenges/useChallenge";
import {calculateCoordOnPolyline} from "../../../../utils/orthonormalCalculs";
import L from 'leaflet';
import Player from "./Player";

interface PlayersProps {
  selectedUserSessions: number[]
}

export default function Players(props: PlayersProps) {
  const {
    selectedUserSessions,
  } = props

  const router = useRouter()
  let challengeId = parseInt(router.query.id)

  const userSessions = useUserSessions(challengeId)

  if (userSessions.isSuccess) {
    return (
      <>
        {
          userSessions.data.map(session => {
            if (selectedUserSessions.includes(session.id!)) {
              return <Player userSessionId={session.id!} userId={session.attributes.userId}/>
            }
          })
        }
      </>
    )
  }
else
  {
    return null
  }
}
