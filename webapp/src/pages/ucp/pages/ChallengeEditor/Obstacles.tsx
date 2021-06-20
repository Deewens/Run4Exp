import {Segment} from "../../../../api/entities/Segment";
import useObstacles from "../../../../api/hooks/obstacles/useObstacles";
import {Marker, Popup, useMap, useMapEvents} from "react-leaflet";
import {calculateCoordOnPolyline} from "../../../../utils/orthonormalCalculs";
import L, {LeafletEventHandlerFnMap} from "leaflet";
import MarkerColors from "../../../../utils/marker-colors";
import {useEffect, useLayoutEffect, useState} from "react";
import Obstacle from "../../../../api/entities/Obstacle";
import useMapEditor from "../../../../hooks/useMapEditor";
import {Box, Button, Menu, MenuItem, PopoverPosition} from "@material-ui/core";
import UpdateObstacleDialog from "./UpdateObstacleDialog";
import MoveObstacle from "./MoveObstacle";
import {useMutation} from "react-query";
import useDeleteObstacle from "../../../../api/hooks/obstacles/useDeleteObstacle";
import * as React from "react";

type Props = {
  segment: Segment
  scale: number
}

export default function Obstacles(props: Props) {
  const {
    segment,
    scale,
  } = props

  const editor = useMapEditor()

  const {selectedObject, setSelectedObject} = useMapEditor()
  const [markerColor, setMarkerColor] = useState(MarkerColors.orangeIcon)
  const [openDialog, setOpenDialog] = useState(false)

  const {mutate: deleteObstacle} = useDeleteObstacle()
  const [obstacleRightClickMenu, setObstacleRightClickMenu] =
    useState<{ open: boolean, anchorPosition: PopoverPosition, obstacle: Obstacle | null}>({
      anchorPosition: {
        top: 0,
        left: 0
      },
      open: false,
      obstacle: null
    })

  const obstacles = useObstacles(segment.id!)

  const handleDeleteObstacle = () => {
    deleteObstacle(obstacleRightClickMenu.obstacle?.id!)
    // Fermeture du menu
    setObstacleRightClickMenu({open: false, obstacle: null, anchorPosition: {top: 0, left: 0}})
  }

  useMapEvents({
    keydown(e) {
      if (e.originalEvent.key === 'Delete') {
        if (selectedObject instanceof Obstacle) {
          deleteObstacle(selectedObject.id!)
          setObstacleRightClickMenu({open: false, obstacle: null, anchorPosition: {top: 0, left: 0}})
        }
      }
    }
  })

  return (
    <>
      {
        obstacles.isSuccess &&
        obstacles.data.map(obstacle => {
          /* Convertie la position en pourcentage provenant de l'API vers la vraie distance divisé par l'échelle pour
             récupérer la distance du point sur la polyline sur le repère orthonormé
             (car length correspond à la longueur rapporté à l'échelle donné par l'utilisateur)
           */
          const orthonormalDistance = (obstacle.attributes.position * segment.attributes.length) / scale
          const position = calculateCoordOnPolyline(segment.attributes.coordinates, orthonormalDistance)

          if (position) {
            let latLng = L.latLng(position.y, position.x)
            if (selectedObject instanceof Obstacle && selectedObject.id === obstacle.id) {
              return (
                <Marker
                  key={obstacle.id}
                  data-obstacle={obstacle}
                  icon={MarkerColors.yellowIcon}
                  position={latLng}
                  eventHandlers={{
                    contextmenu(e) {
                      setObstacleRightClickMenu({
                        open: true,
                        obstacle: obstacle,
                        anchorPosition: {top: e.originalEvent.clientY, left: e.originalEvent.clientX}
                      })
                    }
                  }}
                >
                  <Popup>
                    <p>Énigme : {obstacle.attributes.riddle}</p>
                    <Button fullWidth onClick={() => setOpenDialog(true)}>Éditer</Button></Popup>
                </Marker>
              )
            } else {
              return (
                <Marker
                  key={obstacle.id}
                  data-obstacle={obstacle}
                  icon={MarkerColors.orangeIcon}
                  position={latLng}
                  eventHandlers={{
                    click() {
                      setSelectedObject(obstacle)
                    },
                    contextmenu(e) {
                      setSelectedObject(obstacle)
                      setObstacleRightClickMenu({
                        open: true,
                        obstacle: obstacle,
                        anchorPosition: {top: e.originalEvent.clientY, left: e.originalEvent.clientX}
                      })
                    }
                  }}
                >
                  <Popup>
                    <p>Enigme : {obstacle.attributes.riddle}</p>
                    <Button fullWidth onClick={() => setOpenDialog(true)}>Éditer</Button>
                  </Popup>
                </Marker>
              )
            }
          }
        })
      }
      {selectedObject instanceof Obstacle &&
      <UpdateObstacleDialog
          obstacle={selectedObject}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
      />
      }

      <Menu
        anchorReference="anchorPosition"
        anchorPosition={obstacleRightClickMenu.anchorPosition}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        id="simple-menu"
        open={obstacleRightClickMenu.open}
        onClose={() => setObstacleRightClickMenu({open: false, obstacle: null, anchorPosition: {left: 0, top: 0}})}
      >
        <MenuItem onClick={handleDeleteObstacle}>Supprimer l'obstacle</MenuItem>
      </Menu>
    </>
  )
}