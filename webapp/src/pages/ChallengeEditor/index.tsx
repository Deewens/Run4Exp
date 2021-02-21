import * as React from 'react';
import {MapContainer, ImageOverlay} from 'react-leaflet';
import SkyrimMap from "../../images/maps/map_skyrim.jpg";
import {useEffect, useState} from "react";
import L, {LatLng, LatLngBoundsExpression, LatLngBoundsLiteral, LatLngTuple} from "leaflet";
import {calculateOrthonormalDimension} from "../../utils/orthonormalCalculs";
import {makeStyles} from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import LeafletControlPanel from "../Leaflet/LeafletControlPanel";
import LeafletControlButton from "../../components/LeafletControlButton";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import CheckpointCreation from "./CheckpointCreation";
import Checkpoints from "./Checkpoints";
import {Checkpoint} from "@acrobatt";


const useStyles = makeStyles({
  mapContainer: {
    height: '800px',
    width: '100%',
  },
  loading: {
    height: '90vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const ChallengeEditor = () => {
  const classes = useStyles();

  const [bounds, setBounds] = useState<LatLngBoundsLiteral | null>(null);
  const [position, setPosition] = useState<LatLngTuple | null>(null);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])

  const [imageLoaded, setImageLoaded] = useState(false);
  const [createCheckpointClicked, setCreateCheckpointClicked] = useState(false)

  useEffect(() => {
    let image = new Image();

    setTimeout(() => {
      image.src = SkyrimMap;
      const {width, height} = calculateOrthonormalDimension(image.width, image.height);
      setBounds([[0, 0], [height, width]]);
      setPosition([width / 2, height / 2]);
      setImageLoaded(true)
    }, 1000)

  }, []);

  const handleCreateSegmentClick = () => {
  }

  const handleCreateCheckpointClick = () => {
    setCreateCheckpointClicked(true)
  }

  const handleCheckpointPlaced = (pos: LatLng) => {
    if (bounds) {
      let imgBounds = L.latLngBounds(bounds);
      let checkpoint: Checkpoint = {
        name: "check",
        position: {
          x: pos.lat,
          y: pos.lng
        },
        type: 0
      }
      if (imgBounds.contains(pos)) {
        setCheckpoints(prevState => [...prevState, checkpoint])
        setCreateCheckpointClicked(false)
      }
    }
  }

  const handleCheckpointDelete = (checkpoint: Checkpoint) => {
    let newCheckpoints = checkpoints.filter(item =>
      item.position.x !== checkpoint.position.x && item.position.y !== checkpoint.position.y)
    setCheckpoints(newCheckpoints)
  }

  if (bounds !== null && position !== null) {
    return (
      <MapContainer
        className={classes.mapContainer}
        center={position}
        maxBounds={bounds}
        zoom={10}
        scrollWheelZoom
        crs={L.CRS.Simple}
      >
        <ImageOverlay url={SkyrimMap} bounds={bounds}/>

        {createCheckpointClicked && <CheckpointCreation onCheckpointPlaced={handleCheckpointPlaced} />}
        <Checkpoints checkpoints={checkpoints} onCheckpointDelete={handleCheckpointDelete} />

        <LeafletControlPanel position="topRight">
          <LeafletControlButton onClick={handleCreateSegmentClick}>
            <ShowChartIcon fontSize="inherit" sx={{display: 'inline-block', margin: 'auto', padding: '0'}}/>
          </LeafletControlButton>
          <LeafletControlButton onClick={handleCreateCheckpointClick} active={createCheckpointClicked}>
            O
          </LeafletControlButton>
        </LeafletControlPanel>
      </MapContainer>
    )
  } else {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    )
  }
}

export default ChallengeEditor