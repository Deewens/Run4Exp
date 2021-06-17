import Obstacle from "../../../../api/entities/Obstacle";
import {Box, Grid, Input, Slider, Theme} from "@material-ui/core";
import * as React from "react";
import useMapEditor from "../../../../hooks/useMapEditor";
import useCreateObstacle from "../../../../api/obstacles/useCreateObstacle";
import useUpdateObstacle from "../../../../api/obstacles/useUpdateObstacle";
import {useEffect, useRef, useState} from "react";
import {Segment} from "../../../../api/entities/Segment";
import L, {DomEvent, LatLng} from "leaflet";
import {calculateCoordOnPolyline} from "../../../../utils/orthonormalCalculs";
import {useRouter} from "../../../../hooks/useRouter";
import {useMap, useMapEvents} from "react-leaflet";
import {useQueryClient} from "react-query";
import useChallenge from "../../../../api/challenges/useChallenge";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import LeafletControlPanel from "../../components/Leaflet/LeafletControlPanel";
import {useSnackbar} from "notistack";

const useStyles = makeStyles((theme: Theme) => ({
  slider: {
    margin: '0 auto',
  }
}))

export default function MoveObstacle() {
  const classes = useStyles()
  const router = useRouter()
  let challengeId = parseInt(router.query.id)

  const map = useMap()
  const {selectedObject, setSelectedObject} = useMapEditor()

  const {enqueueSnackbar} = useSnackbar()

  const queryClient = useQueryClient()

  const challenge = useChallenge(challengeId)

  /************************
   **  Obstacle Creation **
   ************************/
  const updateObstacle = useUpdateObstacle()
  const [obstacleDistance, setObstacleDistance] = useState<number | string | Array<number | string>>(selectedObject instanceof Obstacle ? selectedObject.attributes.position * 100 : 0)
  const [obstaclePos, setObstaclePos] = useState<LatLng>(L.latLng(0, 0))

  useEffect(() => {
    console.log(selectedObject)
  }, [])

  const handleSliderObstacleChange = (event: Event, newValue: number | number[]) => {
    map.dragging.disable()
    if (selectedObject instanceof Obstacle) {
      setObstacleDistance(newValue)
      const previousObstacles = queryClient.getQueryData<Obstacle[]>(['obstacles', selectedObject.attributes.segmentId])
      if (previousObstacles) {
        const obstacleToUpdate = previousObstacles.find(obstacle => selectedObject.id == obstacle.id)
        if (obstacleToUpdate) {
          obstacleToUpdate.attributes.position = Number(newValue) / 100
          const indexToUpdate = previousObstacles.findIndex(obstacle => selectedObject.id == obstacle.id)

          previousObstacles[indexToUpdate] = obstacleToUpdate

          queryClient.setQueryData<Obstacle[]>(['obstacles', selectedObject.attributes.segmentId], previousObstacles)
        }
      }
    }
  }

  const handleSliderObstacleChangeCommitted = (event: object, value: number | number[]) => {
    setObstacleDistance(value)
    map.dragging.enable()

    if (selectedObject instanceof Obstacle) {
      updateObstacle.mutate({
        id: selectedObject.id!,
        riddle: selectedObject.attributes.riddle,
        response: selectedObject.attributes.response,
        segmentId: selectedObject.attributes.segmentId,
        position: Number(value) / 100
      }, {
        onSuccess(data) {
          enqueueSnackbar("Obstacle mise à jour !", {variant: 'success'})
        },
      })
    }


  }

  const handleInputObstacleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    map.scrollWheelZoom.disable()
    map.doubleClickZoom.disable()
    if (selectedObject instanceof Obstacle) {
      setObstacleDistance(event.target.value === '' ? '' : Number(event.target.value))
      selectedObject.attributes.position = Number(event.target.value)
    }
  }

  const handleInputObstacleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    let distance = Number(event.target.value)
    map.scrollWheelZoom.enable()
    map.doubleClickZoom.enable()
    if (selectedObject instanceof Obstacle) {
      if (obstacleDistance < 1) {
        setObstacleDistance(1);
        distance = 0
        return;
      } else if (obstacleDistance > 99) {
        setObstacleDistance(99);
        distance = 100
        return;
      }

      updateObstacle.mutate({
        id: selectedObject.id!,
        riddle: selectedObject.attributes.riddle,
        response: selectedObject.attributes.response,
        segmentId: selectedObject.attributes.segmentId,
        position: distance / 100
      }, {
        onSuccess(data) {
          enqueueSnackbar("Obstacle mise à jour !", {variant: 'success'})
        },
      })


    }
  }

  useEffect(() => {
    if (selectedObject instanceof Segment && challenge.isSuccess) {
      let point = calculateCoordOnPolyline(selectedObject.attributes.coordinates, Number(obstacleDistance) / challenge.data.attributes.scale)

      if (point) {
        let latLng = L.latLng(point.y, point.x)
        setObstaclePos(latLng)
      }
    }
  }, [obstacleDistance])

  const sliderRef = useRef<HTMLSpanElement>(null)

  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 1000,
        marginLeft: 'auto',
        marginRight: 'auto',
        left: 0,
        right: 0,
      }}
    >
      <Box sx={{width: 400, margin: '0 auto',}}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{
            backgroundColor: 'white',
          }}
        >
          <Grid item xs>
            <Slider
              ref={sliderRef}
              value={typeof obstacleDistance === 'number' ? obstacleDistance : 0}
              step={0.1}
              min={1}
              max={99}
              onChange={handleSliderObstacleChange}
              onChangeCommitted={handleSliderObstacleChangeCommitted}
              aria-labelledby="input-slider"
            />
          </Grid>
          <Grid item>
            <Input
              value={obstacleDistance}
              size="small"
              onClick={() => {map.scrollWheelZoom.disable(); map.doubleClickZoom.disable()}}
              onChange={handleInputObstacleChange}
              onBlur={handleInputObstacleBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  //@ts-ignore
                  let distance = Number(e.target.value)

                  map.scrollWheelZoom.enable()
                  map.doubleClickZoom.enable()
                  if (selectedObject instanceof Obstacle) {
                    if (obstacleDistance < 1) {
                      setObstacleDistance(1);
                      distance = 0
                      return;
                    } else if (obstacleDistance > 99) {
                      setObstacleDistance(99);
                      distance = 100
                      return;
                    }

                    updateObstacle.mutate({
                      id: selectedObject.id!,
                      riddle: selectedObject.attributes.riddle,
                      response: selectedObject.attributes.response,
                      segmentId: selectedObject.attributes.segmentId,
                      position: distance / 100
                    }, {
                      onSuccess(data) {
                        enqueueSnackbar("Obstacle mise à jour !", {variant: 'success'})
                      },
                    })


                  }
                }
              }}
              inputProps={{
                step: 0.1,
                min: 0,
                max: 100,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>

  )
}