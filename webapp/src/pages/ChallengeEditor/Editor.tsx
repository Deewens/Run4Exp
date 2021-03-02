import * as React from 'react';
import {MapContainer, ImageOverlay} from 'react-leaflet';
import SkyrimMap from "../../images/maps/map_skyrim.jpg";
import {useEffect, useState} from "react";
import L, {LatLng, LatLngBoundsExpression, LatLngBoundsLiteral, LatLngTuple, LeafletMouseEvent} from "leaflet";
import {calculateOrthonormalDimension} from "../../utils/orthonormalCalculs";
import {makeStyles} from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import LeafletControlPanel from "../Leaflet/LeafletControlPanel";
import LeafletControlButton from "../../components/LeafletControlButton";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import CheckpointCreation from "./CheckpointCreation";
import Checkpoints from "./Checkpoints";
import useCreateCheckpoint from "../../api/useCreateCheckpoint";
import {useRouter} from "../../hooks/useRouter";
import {Checkpoint, useCheckpoints} from "../../api/useCheckpoints";
import Segments from "./Segments";
import SegmentCreation from "./SegmentCreation";


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

type Props = {
  image: string
}

const Editor = (props: Props) => {
  const classes = useStyles();

  const router = useRouter();

  // @ts-ignore
  let {id} = router.query;

  //console.log(checkpointsList.data?._embedded.checkpointResponseModelList[0].challengeId);
  const createCheckpointMutation = useCreateCheckpoint();

  const [bounds, setBounds] = useState<LatLngBoundsLiteral | null>(null);
  const [position, setPosition] = useState<LatLngTuple | null>(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [image, setImage] = useState<string>(props.image);
  const [createCheckpointClicked, setCreateCheckpointClicked] = useState(false)

  const [createSegmentClicked, setCreateSegmentClicked] = useState(false);
  const [checkpointClicked, setCheckpointClicked] = useState<Checkpoint | null>()

  useEffect(() => {
    let img = new Image();
    img.src = props.image;
    img.onload = () => {
      const {width, height} = calculateOrthonormalDimension(img.width, img.height);
      setBounds([[0, 0], [height, width]]);
      setPosition([width / 2, height / 2]);
      setImageLoaded(true)
    }
  }, []);

  const handleCreateSegmentClick = () => {
    setCreateSegmentClicked(true)
  }

  const handleCreateCheckpointClick = () => {
    setCreateCheckpointClicked(true)
  }

  const handleCheckpointPlaced = (pos: LatLng) => {
    if (bounds) {
      let imgBounds = L.latLngBounds(bounds);

      if (imgBounds.contains(pos)) {
        createCheckpointMutation.mutate({
          challengeId: id,
          checkpointType: 1,
          name: "check",
          x: pos.lat,
          y: pos.lng
        })

        setCreateCheckpointClicked(false)
      }
    }
  }

  const handleCheckpointClick = (e: LeafletMouseEvent, checkpoint: Checkpoint) => {
    let marker: L.Marker = e.target;
    //console.log(marker);

    if (checkpointClicked) {
      setCheckpointClicked(checkpoint);
    } else {
      setCheckpointClicked(checkpoint);
    }
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
        <ImageOverlay url={image} bounds={bounds}/>

        {createCheckpointClicked && <CheckpointCreation onCheckpointPlaced={handleCheckpointPlaced} />}
        <Checkpoints onCheckpointClick={handleCheckpointClick} />
        <Segments />


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

export default Editor