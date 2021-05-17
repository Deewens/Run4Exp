import * as React from 'react'
import {ImageOverlay, MapContainer} from 'react-leaflet'
import {useEffect, useState} from "react";
import L, {LatLngBoundsLiteral, LatLngTuple} from "leaflet";
import CircularProgress from "@material-ui/core/CircularProgress";
import useChallenge from "../../../../api/useChallenge";
import {calculateOrthonormalDimension} from "../../../../utils/orthonormalCalculs";
import useChallengeImage from "../../../../api/useChallengeImage";
import {makeStyles, Theme} from '@material-ui/core';
import ChangeView from "../ChallengeEditor/ChangeView";
import useMain from "../../useMain";
import Checkpoints from "./Checkpoints";
import Segments from './Segments';

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
  const challenge = useChallenge(1)
  const challengeImage = useChallengeImage(1);

  const main = useMain()
  useEffect(() => {
    main.toggleSidebar(false)
  }, [])

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

        <Checkpoints/>
        <Segments />
      </MapContainer>
    )
  } else {
    return null
  }
}