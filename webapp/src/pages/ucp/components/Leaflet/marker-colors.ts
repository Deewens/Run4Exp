import L from "leaflet"
import Shadow from '../../../../images/markers/marker-shadow.png'
import BlueIcon from '../../../../images/markers/marker-icon-2x-blue.png'
import BlueIconSelected from '../../../../images/markers/marker-icon-2x-blue-selected.png'
import GoldIcon from '../../../../images/markers/marker-icon-2x-gold.png'
import RedIcon from '../../../../images/markers/marker-icon-2x-red.png'
import RedIconSelected from '../../../../images/markers/marker-icon-2x-red-selected.png'
import GreenIcon from '../../../../images/markers/marker-icon-2x-green.png'
import GreenIconSelected from '../../../../images/markers/marker-icon-2x-green-selected.png'
import OrangeIcon from '../../../../images/markers/marker-icon-2x-orange.png'
import YellowIcon from '../../../../images/markers/marker-icon-2x-yellow.png'
import VioletIcon from '../../../../images/markers/marker-icon-2x-violet.png'
import GreyIcon from '../../../../images/markers/marker-icon-2x-grey.png'
import BlackIcon from '../../../../images/markers/marker-icon-2x-black.png'

const MarkerColors = {
  blueIcon: new L.Icon({
    iconUrl: BlueIcon,
    shadowUrl: Shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),

  blueIconSelected: new L.Icon({
    iconUrl: BlueIconSelected,
    shadowUrl: Shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),

  goldIcon: new L.Icon({
    iconUrl: GoldIcon,
    shadowUrl: Shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),

  redIcon: new L.Icon({
    iconUrl: RedIcon,
    shadowUrl: Shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),

  redIconSelected: new L.Icon({
    iconUrl: RedIconSelected,
    shadowUrl: Shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),

  greenIcon: new L.Icon({
    iconUrl: GreenIcon,
    shadowUrl: Shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),

  greenIconSelected: new L.Icon({
    iconUrl: GreenIconSelected,
    shadowUrl: Shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),

  orangeIcon: new L.Icon({
    iconUrl: OrangeIcon,
    shadowUrl: Shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),

  yellowIcon: new L.Icon({
    iconUrl: YellowIcon,
    shadowUrl: Shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),

  violetIcon: new L.Icon({
    iconUrl: VioletIcon,
    shadowUrl: Shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),

  greyIcon: new L.Icon({
    iconUrl: GreyIcon,
    shadowUrl: Shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),

  blackIcon: new L.Icon({
    iconUrl: BlackIcon,
    shadowUrl: Shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
}

export default MarkerColors