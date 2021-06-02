import * as React from 'react'
import {MapContainer, ImageOverlay} from 'react-leaflet'
import {useEffect, useState} from "react"
import L, {LatLngBoundsLiteral, LatLngTuple} from "leaflet"
import {calculateOrthonormalDimension} from "../../../../utils/orthonormalCalculs"
import {makeStyles} from "@material-ui/core/styles"
import CircularProgress from '@material-ui/core/CircularProgress'
import LeafletControlPanel from "../../components/Leaflet/LeafletControlPanel"
import {useRouter} from "../../../../hooks/useRouter"
import {Button, Divider, Paper, Theme, Typography} from "@material-ui/core"
import useChallenge from "../../../../api/useChallenge"
import UpdateChallengeInfosDialog from "./UpdateChallengeInfosDialog"
import ChangeView from "./ChangeView"
import MapEditor from "./MapEditor"
import {MapEditorProvider} from "../../../../hooks/useMapEditor";

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

  useEffect(() => {
    if (challenge.isSuccess) {
    }
  }, [challenge])

  const handleBackToList = () => {
    router.push('/ucp/challenges')
  }

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

          <Paper className={classes.mapHeader} elevation={0} sx={{zIndex: theme => theme.zIndex.modal-1}}>
            <Typography sx={{display: {xs: 'none', sm: 'none', md: 'block'}}} typography="h6" px={1.5}>
              {challenge.isSuccess && challenge.data.attributes.name}
            </Typography>
            <Button  onClick={() => setOpenUpdateInfosDialog(true)}>
              Paramétrage
            </Button>
          </Paper>

          <LeafletControlPanel position="bottomRight">
            <Button onClick={handleBackToList} variant="contained">Retour à la liste</Button>
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