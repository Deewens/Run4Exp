import {useMap} from "react-leaflet";
import {LatLngBoundsExpression, LatLngBoundsLiteral, LatLngExpression} from "leaflet";

type Props = {
  center: LatLngExpression
  zoom: number
  maxBounds: LatLngBoundsLiteral
}

const ChangeView = ({center, zoom, maxBounds}: Props) => {
  const map = useMap();
  //map.setView(center, zoom);
  map.setMaxBounds(maxBounds);
  setTimeout(() => map.invalidateSize(), 400)
  return null;
}

export default ChangeView;