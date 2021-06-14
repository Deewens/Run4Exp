import * as React from 'react'
import {ImageOverlay, MapContainer} from 'react-leaflet'
import {useEffect, useState} from "react";
import L, {LatLngBoundsLiteral, LatLngTuple} from "leaflet";
import CircularProgress from "@material-ui/core/CircularProgress";
import useChallenge from "../../../../api/challenges/useChallenge";
import {calculateOrthonormalDimension} from "../../../../utils/orthonormalCalculs";
import useChallengeImage from "../../../../api/challenges/useChallengeImage";
import {Box, Button, IconButton, makeStyles, Paper, Theme} from '@material-ui/core';
import ChangeView from "../ChallengeEditor/ChangeView";
import useMain from "../../useMain";
import useUrlParams from "../../../../hooks/useUrlParams";
import {useRouter} from "../../../../hooks/useRouter";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Players from "./Players";
import ChoosePlayerDrawer from "./ChoosePlayerDrawer";
import Segments from "../../components/ReadOnlyMap/Segments";
import Checkpoints from "../../components/ReadOnlyMap/Checkpoints";

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

export default function AdminMapView() {
  const classes = useStyles()
  const router = useRouter()

  const challengeId = parseInt(router.query.id)
  const urlParams = useUrlParams()

  const challenge = useChallenge(challengeId)
  const challengeImage = useChallengeImage(challengeId);

  const main = useMain()
  useEffect(() => {
    main.toggleSidebar(false)
  }, [])

  const [bounds, setBounds] = useState<LatLngBoundsLiteral | null>(null)
  const [center, setCenter] = useState<LatLngTuple | null>(null)

  const [openChoosePlayerDrawer, setOpenChoosePlayerDrawer] = useState(false)
  const toggleChoosePlayerDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setOpenChoosePlayerDrawer(open);
  }

  const [selectedSessions, setSelectedSessions] = useState<number[]>([])

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
          <Players selectedUserSessions={selectedSessions} />
          <Paper
            component={IconButton}
            sx={{
              borderTopLeftRadius: '1em',
              borderTopRightRadius: '1em',
              zIndex: '9999',
              width: 50,
              position: 'absolute',
              bottom: -10,
              marginLeft: 'auto',
              marginRight: 'auto',
              left: 0,
              right: 0,
              textAlign: 'center',
              '&:hover': {
                backgroundColor: 'whitesmoke',
                bottom: -3,
              },
              display: openChoosePlayerDrawer ? 'none' : 'block',
            }}
            onClick={() => setOpenChoosePlayerDrawer(true)}
          >
            <ExpandLessIcon/>
          </Paper>
          <ChoosePlayerDrawer
            challengeId={challengeId}
            open={openChoosePlayerDrawer}
            onClose={toggleChoosePlayerDrawer(false)}
            onOpen={toggleChoosePlayerDrawer(true)}
            selectedSessions={selectedSessions}
            setSelectedSessions={setSelectedSessions}
          />
        </MapContainer>
      </>
    )
  } else {
    return null
  }
}