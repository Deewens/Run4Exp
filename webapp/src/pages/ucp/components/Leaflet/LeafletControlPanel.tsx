import * as React from 'react';
import {LeafletPositionClasses} from "@acrobatt";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";

// Classes used by Leaflet to position controls
const POSITION_CLASSES: LeafletPositionClasses = {
  bottomLeft: 'leaflet-bottom leaflet-left',
  bottomRight: 'leaflet-bottom leaflet-right',
  topLeft: 'leaflet-top leaflet-left',
  topRight: 'leaflet-top leaflet-right',
}

const useStyles = makeStyles({
  root: {
    fontSize: 22,
  },
  control: {

  }
})

type Props = {
  position: keyof LeafletPositionClasses,
  children: React.ReactNode,
  defaultStyle?: boolean,
}

const LeafletControlPanel = (props: Props) => {
  const {
    position,
    children,
    defaultStyle = true,
  } = props

  const classes = useStyles()

  const positionClass = (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topRight

  return (
    <div className={clsx(positionClass, classes.root)}>
      <div className={clsx("leaflet-control", {[classes.control]: defaultStyle})} style={{display: 'flex', flexDirection: 'column'}}>
        {children}
      </div>
    </div>
  )
}

export default LeafletControlPanel;