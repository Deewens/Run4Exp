import React, {useContext, useEffect, useState} from 'react'
import {Segment} from "../api/entities/Segment";
import {Checkpoint} from "../api/entities/Checkpoint";
import Obstacle from "../api/entities/Obstacle";
import L from 'leaflet'
import useUpdateChallenge from "../api/challenges/useUpdateChallenge";
import {Challenge} from "../api/entities/Challenge";
import useChallenge from "../api/challenges/useChallenge";

type MapEditorContext = {
  selectedObject: Segment | Checkpoint | Obstacle | null
  setSelectedObject: (value: React.SetStateAction<Segment | Checkpoint | Obstacle | null>) => void
  bounds: L.LatLngBoundsLiteral
  setBounds: (value: React.SetStateAction<L.LatLngBoundsLiteral>) => void
}

const MapEditorContext = React.createContext<MapEditorContext>({
  selectedObject: null,
  setSelectedObject: () => console.warn('no provider'),
  bounds: [[0, 0], [0, 0]],
  setBounds: () => console.warn('no provider'),
})

type Props = {
  children: React.ReactNode
  bounds: L.LatLngBoundsLiteral
}

export const MapEditorProvider = (props: Props) => {
  const {
    children,
    bounds
  } = props

  const mapEditor = useProvideMapEditor()

  return (
    <MapEditorContext.Provider value={{bounds, ...mapEditor}}>
      {children}
    </MapEditorContext.Provider>
  )
}

export default function useMapEditor() {
  return useContext(MapEditorContext)
}

function useProvideMapEditor() {
  const [selectedObject, setSelectedObject] = useState<Segment | Checkpoint | Obstacle | null>(null)
  const [bounds, setBounds] = useState<L.LatLngBoundsLiteral>([[0, 0], [0, 0]])

  return {
    selectedObject,
    setSelectedObject,
    setBounds
  }
}

