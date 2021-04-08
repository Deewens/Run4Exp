import * as React from 'react';
import {MapContainer, ImageOverlay, useMapEvents, Marker} from 'react-leaflet';
import {useEffect, useState} from "react";
import L, {LatLng, LatLngBoundsLiteral, LatLngTuple, LeafletMouseEvent} from "leaflet";
import {calculateOrthonormalDimension} from "../../../../utils/orthonormalCalculs";
import {makeStyles} from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import LeafletControlPanel from "../../components/Leaflet/LeafletControlPanel";
import LeafletControlButton from "../../components/Leaflet/LeafletControlButton";
import CheckpointCreation from "./CheckpointCreation";
import Checkpoints from "./Checkpoints";
import useCreateCheckpoint from "../../../../api/useCreateCheckpoint";
import {useRouter} from "../../../../hooks/useRouter";
import {useCheckpoints} from "../../../../api/useCheckpoints";
import Segments from "./Segments";
import {Box, Button, Paper, Theme, Typography} from "@material-ui/core";
import StartFlag from '../../../../images/start.svg'
import FinishFlag from '../../../../images/finish-flag.svg'
import {useSnackbar} from "notistack";
import {Checkpoint} from "../../../../api/entities/Checkpoint";
import {Segment} from "../../../../api/entities/Segment";
import CancelIcon from '@material-ui/icons/Cancel'
import {CheckpointType} from "@acrobatt";
import useChallenge from "../../../../api/useChallenge";
import UpdateChallengeInfosDialog from "./UpdateChallengeInfosDialog";
import ChangeView from "./ChangeView";
import MarkerColors from "../../components/Leaflet/marker-colors";
import MapEditor from "./MapEditor";

const useStyles = makeStyles((theme: Theme) => ({
  mapHeader: {
    position: 'absolute',
    top: 10,
    left: 75,
    cursor: 'grab',
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 1,
    paddingRight: 1,
    border: '1px solid gray',
    '& > *:hover': {
      color: theme.palette.primary.main,
    },
  },
  mapContainer: {
    height: 'calc(100vh - 65px)',
    width: '100%',
  },
  loading: {
    height: '90vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

type Props = {
  image: string
}

const Editor = (props: Props) => {
  const classes = useStyles()

  const router = useRouter()

  // Get Challenge Id from URL
  // @ts-ignore
  let id = parseInt(router.query.id)
  
  const challenge = useChallenge(id)

  const [bounds, setBounds] = useState<LatLngBoundsLiteral | null>(null)
  const [position, setPosition] = useState<LatLngTuple | null>(null)

  const [imageLoaded, setImageLoaded] = useState(false)
  const [image, setImage] = useState<string>(props.image)


  const [createSegmentClicked, setCreateSegmentClicked] = useState(false);
  const [checkpointClicked, setCheckpointClicked] = useState<Checkpoint | null>()

  const [openUpdateInfosDialog, setOpenUpdateInfosDialog] = useState(false)

  useEffect(() => {
    let img = new Image();
    img.src = props.image;
    img.onload = () => {
      const {width, height} = calculateOrthonormalDimension(img.width, img.height);
      setBounds([[0, 0], [height, width]]);
      setPosition([width / 2, height / 2]);
      setImageLoaded(true)
    }
  }, [])

  const handleCreateSegmentClick = () => {
    setCreateSegmentClicked(true)
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
  const [distanceValue, setDistanceValue] = useState(0)
  const [sliderMin, setSliderMin] = useState(0)
  const [sliderMax, setSliderMax] = useState(100)

  const handleSegmentClick = (segment: Segment) => {
    setSliderMin(0)
    setSliderMax(segment.attributes.length)
  }

  const handlePlaceObstacle = () => {

  }

  const handleBackToList = () => {
    router.push('/ucp/challenges')
  }

  if (bounds !== null && position !== null) {
    return (
      <>
        <MapContainer
          className={classes.mapContainer}
          center={position}
          maxBounds={bounds}
          zoom={10}
          scrollWheelZoom
          crs={L.CRS.Simple}
        >
          <ChangeView center={position} zoom={10} maxBounds={bounds} />
          <ImageOverlay url={image} bounds={bounds}/>

          <MapEditor bounds={bounds} />

          <Paper className={classes.mapHeader} elevation={0} sx={{zIndex: theme => theme.zIndex.modal-1}}>
            <Typography typography="h4" fontWeight="bold" fontSize="2rem" px={1.5} onClick={() => setOpenUpdateInfosDialog(true)}>
              {challenge.isSuccess && challenge.data.attributes.name}
            </Typography>
          </Paper>


          <LeafletControlPanel position="bottomRight">
            <Button onClick={handleBackToList} variant="contained">Retour à la liste</Button>
          </LeafletControlPanel>
        </MapContainer>
        {challenge.isSuccess &&
          <UpdateChallengeInfosDialog
              open={openUpdateInfosDialog}
              setOpen={setOpenUpdateInfosDialog}
              name={challenge.data.attributes.name}
              shortDescription={challenge.data.attributes.description}
              htmlDescription={challenge.data.attributes.description}
          />
        }
      </>
    )
  } else {
    return (
      <div className={classes.loading}>
        <CircularProgress/>
      </div>
    )
  }
}

export default Editor