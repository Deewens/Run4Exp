import * as React from 'react'
import {MapContainer, ImageOverlay} from 'react-leaflet'
import {useEffect, useState} from "react"
import L, {LatLngBoundsLiteral, LatLngTuple} from "leaflet"
import {calculateOrthonormalDimension} from "../../../../utils/orthonormalCalculs"
import {makeStyles} from "@material-ui/core/styles"
import CircularProgress from '@material-ui/core/CircularProgress'
import LeafletControlPanel from "../../components/Leaflet/LeafletControlPanel"
import {useRouter} from "../../../../hooks/useRouter"
import {Button, Paper, Theme, Typography} from "@material-ui/core"
import useChallenge from "../../../../api/hooks/challenges/useChallenge"
import UpdateChallengeInfosDialog from "./UpdateChallengeInfosDialog/UpdateChallengeInfosDialog"
import ChangeView from "./ChangeView"
import MapEditor from "./MapEditor"
import {MapEditorProvider} from "../../../../hooks/useMapEditor";
import DownloadDoneIcon from '@material-ui/icons/DownloadDone';
import { useIsFetching } from "react-query";

const useStyles = makeStyles((theme: Theme) => ({
  mapHeader: {
    position: 'absolute',
    top: 10,
    left: 75,
    maxWidth: '80%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    border: '1px solid gray',
    paddingLeft: 5,
    alignItems: 'center',
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

  const [openUpdateInfosDialog, setOpenUpdateInfosDialog] = useState(false)

  useEffect(() => {
    let img = new Image()
    img.src = props.image
    img.onload = () => {
      const {width, height} = calculateOrthonormalDimension(img.width, img.height)
      setBounds([[0, 0], [height, width]])
      setPosition([width / 2, height / 2])
      setImageLoaded(true)
    }
  }, [])

  const handleBackToList = () => {
    router.push('/ucp/challenges')
  }

  const isFetching = useIsFetching()

  if (bounds !== null && position !== null) {
    return (
      <MapEditorProvider bounds={bounds}>
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

          {challenge.isSuccess && <MapEditor />}

          <Paper className={classes.mapHeader} elevation={0} sx={{zIndex: 1000}}>
            <Typography title="Indicateur de chargement" typography="h6"  pr={1}>
              {isFetching ? <CircularProgress  size={19} sx={{verticalAlign: 'middle',}} /> : <DownloadDoneIcon sx={{fontSize: 19, verticalAlign: 'middle',}} />}
            </Typography>
            <Typography sx={{display: {xs: 'none', sm: 'none', md: 'block'}}} typography="h6" pr={1.5}>
              {challenge.isSuccess && challenge.data.attributes.name}
            </Typography>
            <Button sx={{pb: 0,}} onClick={() => setOpenUpdateInfosDialog(true)}>
              Paramétrage
            </Button>
          </Paper>

          <LeafletControlPanel position="bottomRight">
            <Button onClick={handleBackToList} variant="contained">Retour</Button>
          </LeafletControlPanel>
        </MapContainer>
        {challenge.isSuccess &&
          <UpdateChallengeInfosDialog
              open={openUpdateInfosDialog}
              setOpen={setOpenUpdateInfosDialog}
              challenge={challenge.data}
          />
        }
      </MapEditorProvider>
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