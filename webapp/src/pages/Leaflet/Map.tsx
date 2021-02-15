import * as React from 'react';
import {SetStateAction, useEffect, useState} from 'react';
import {MapContainer, ImageOverlay} from 'react-leaflet'
import {Container, createStyles} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import L, {LatLngBoundsExpression, LatLngExpression, LatLngTuple} from "leaflet";
import SkyrimMap from "../../images/maps/map_skyrim.jpg";
import {Point, Segment} from "@acrobatt";
import {
  calculateDistanceBetweenPoint,
  calculateOrthonormalDimension,
} from "../../utils/orthonormalCalculs";
import ChangeView from './ChangeView';
import CreateSegment from "./CreateSegment";

const useStyles = makeStyles({
  mapContainer: {
    height: '1000px',
    width: '100%'
  }
});

type Props = {
  isCreateSegmentClicked: boolean;
  setIsCreateSegmentClicked: (value: SetStateAction<boolean>) => void
};

const Map = ({isCreateSegmentClicked, setIsCreateSegmentClicked}: Props) => {
  const classes = useStyles();

  const [bounds, setBounds] = useState<LatLngBoundsExpression>([[0, 0], [1, 1]]);
  const [position, setPosition] = useState<LatLngTuple>([0, 0]);

  const [polyline, setPolyline] = useState<LatLngExpression[]>([]);

  const [segmentList, setSegmentList] = useState<Segment[]>([]);

  const [distance, setDistance] = useState<number>(0);

  useEffect(() => {
    let img = new Image();
    img.src = SkyrimMap;

    const {width, height} = calculateOrthonormalDimension(img.width, img.height);
    setBounds([[0, 0], [height, width]]);
    setPosition([width / 2, height / 2]);
  }, []);

  useEffect(() => {
    polyline.forEach((value, i, arr) => {
      if (arr[i - 1]) {
        // D'après Typescript, LatLngExpression n'a pas de lat ou de lng, c'est faux, ts-ignore en attendant
        // une autre solution
        // @ts-ignore
        let p1: Point = {x: arr[i - 1].lng, y: arr[i - 1].lat};
        // @ts-ignore
        let p2: Point = {x: value.lng, y: value.lat};

        setDistance(calculateDistanceBetweenPoint(p1, p2, 100));
      }
    });
  }, [polyline])

  return (
    <Container maxWidth="lg">
      <p>Distance : {distance}</p>
      <MapContainer
        center={position}
        zoom={10}
        scrollWheelZoom={true}
        className={classes.mapContainer}
        crs={L.CRS.Simple}
      >
        <ChangeView center={position} zoom={10} maxBounds={bounds}/>
        <CreateSegment
          isCreateSegmentClicked={isCreateSegmentClicked}
          setIsCreateSegmentClicked={setIsCreateSegmentClicked}
          segmentList={segmentList}
          setSegmentList={setSegmentList}
          polyline={polyline}
          setPolyline={setPolyline}
        />
        <ImageOverlay url={SkyrimMap} bounds={bounds}/>

      </MapContainer>
    </Container>
  )
}

export default Map;