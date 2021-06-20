import * as React from 'react'
import {ImageOverlay, MapContainer} from 'react-leaflet'
import {useEffect, useState} from "react";
import L, {LatLngBoundsLiteral, LatLngTuple} from "leaflet";
import CircularProgress from "@material-ui/core/CircularProgress";
import useChallenge from "../../../../api/hooks/challenges/useChallenge";
import {calculateOrthonormalDimension} from "../../../../utils/orthonormalCalculs";
import useChallengeImage from "../../../../api/hooks/challenges/useChallengeImage";
import {Button, makeStyles, Theme} from '@material-ui/core';
import ChangeView from "../ChallengeEditor/ChangeView";
import useMain from "../../useMain";
import useUrlParams from "../../../../hooks/useUrlParams";
import {useRouter} from "../../../../hooks/useRouter";
import Player from "./Player";
import Obstacles from "./Obstacles";
import LeafletControlPanel from "../../components/Leaflet/LeafletControlPanel";
import HistoryViewDialog from "./HistoryViewDialog";
import Segments from "../../components/ReadOnlyMap/Segments";
import Checkpoints from "../../components/ReadOnlyMap/Checkpoints";
import PlayerDetailsDialog from "../PublishedChallengesAdmin/PlayerDetailsDialog";
import {useAuth} from "../../../../hooks/useAuth";

const useStyles = makeStyles((theme: Theme) => ({
  loading: {
    height: '90vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: 'calc(100vh - 65px)',
    width: '100%',
  },
}))

export default function MapView() {
  const classes = useStyles()
  const router = useRouter()

  const { user } = useAuth()

  const challengeId = parseInt(router.query.id)
  const urlParams = useUrlParams()

  const challenge = useChallenge(challengeId)
  const challengeImage = useChallengeImage(challengeId);

  const main = useMain()
  useEffect(() => {
    main.toggleSidebar(false)
  }, [])

  const [openHistoryDialog, setOpenHistoryDialog] = useState(false)
  const handleCloseHistoryDialog = () => {
    setOpenHistoryDialog(false)
  }

  const [bounds, setBounds] = useState<LatLngBoundsLiteral | null>(null)
  const [center, setCenter] = useState<LatLngTuple | null>(null)

  useEffect(() => {
    if (challengeImage.isSuccess && challengeImage.data) {
      let img = new Image()
      img.src = challengeImage.data
      img.onload = () => {
        const {width, height} = calculateOrthonormalDimension(img.width, img.height)
        setBounds([[0, 0], [height, width]])
        setCenter([width / 2, height / 2])
      }
    }
  }, [challengeImage.isSuccess])

  if (challenge.isLoading || challengeImage.isLoading) {
    return (
      <div className={classes.loading}>
        <CircularProgress/>
      </div>
    )
  } else if (challenge.isSuccess && challengeImage.isSuccess && challengeImage.data && bounds && center) {
    return (
      <>
        <MapContainer
          className={classes.mapContainer}
          center={center}
          maxBounds={bounds}
          zoom={10}
          scrollWheelZoom
          crs={L.CRS.Simple}
        >
          <ImageOverlay url={challengeImage.data} bounds={bounds}/>
          <ChangeView center={center} zoom={10} maxBounds={bounds}/>

          <Checkpoints challengeId={challengeId} />
          <Segments challengeId={challengeId} />
          <Player />
          <LeafletControlPanel position="bottomRight">
            <Button onClick={() => setOpenHistoryDialog(true)} variant="contained">Détails et historique</Button>
          </LeafletControlPanel>
        </MapContainer>
        <PlayerDetailsDialog
          open={openHistoryDialog}
          onClose={handleCloseHistoryDialog}
          user={user!}
          sessionId={parseInt(urlParams.get("session")!)}
          challengeId={challengeId}
        />
      </>
    )
  } else {
    return null
  }
}