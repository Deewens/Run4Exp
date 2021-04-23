import React, {useContext, useEffect, useState} from 'react'
import {Segment} from "../api/entities/Segment";
import {Checkpoint} from "../api/entities/Checkpoint";
import Obstacle from "../api/entities/Obstacle";
import useUpdateChallenge from "../api/useUpdateChallenge";
import {Challenge} from "../api/entities/Challenge";
import useChallenge from "../api/useChallenge";

type MapEditorContext = {
  selectedObject: Segment | Checkpoint | Obstacle | null
  setSelectedObject: (value: React.SetStateAction<Segment | Checkpoint | Obstacle | null>) => void
}

const MapEditorContext = React.createContext<MapEditorContext>({
  selectedObject: null,
  setSelectedObject: () => console.warn('no provider'),
})

type Props = {
  children: React.ReactNode
  selectedObject?: Segment | Checkpoint | Obstacle | null
}

export const MapEditorProvider = ({children, selectedObject}: Props) => {
  const mapEditor = useProvideMapEditor()

  return (
    <MapEditorContext.Provider value={mapEditor}>
      {children}
    </MapEditorContext.Provider>
  )
}

export default function useMapEditor() {
  return useContext(MapEditorContext)
}

function useProvideMapEditor() {
  const [selectedObject, setSelectedObject] = useState<Segment | Checkpoint | Obstacle | null>(null)

  return {
    selectedObject,
    setSelectedObject,
  }
}

