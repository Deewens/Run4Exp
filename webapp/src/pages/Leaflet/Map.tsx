import * as React from 'react';
import {SetStateAction, useEffect, useState} from 'react';
import {MapContainer, ImageOverlay} from 'react-leaflet'
import {Container, createStyles} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import L, {LatLngBounds, LatLngBoundsExpression, LatLngBoundsLiteral, LatLngExpression, LatLngTuple} from "leaflet";
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
    height: '800px',
    width: '100%'
  }
});

type Props = {
  isCreateSegmentClicked: boolean;
  setIsCreateSegmentClicked: (value: SetStateAction<boolean>) => void;
  image: string;
};

const Map = ({isCreateSegmentClicked, setIsCreateSegmentClicked, image}: Props) => {
  const classes = useStyles();

  const [bounds, setBounds] = useState<LatLngBoundsLiteral | null>(null);
  const [position, setPosition] = useState<LatLngTuple>([0, 0]);

  const [polyline, setPolyline] = useState<LatLngExpression[]>([]);

  const [segmentList, setSegmentList] = useState<Segment[]>([]);

  const [distance, setDistance] = useState<number>(0);

  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    let img = new Image();
    img.src = image;
    img.onload = () => {
      console.log(img.width + " " + img.height);
      const {width, height} = calculateOrthonormalDimension(img.width, img.height);
      console.log(width + " " + height);
      setBounds([[0, 0], [height, width]]);
      setPosition([width / 2, height / 2]);
      setImgLoaded(true);
    }


  }, []);

  useEffect(() => {
    console.log(bounds);
  }, [bounds]);

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
        <ChangeView center={position} zoom={10} maxBounds={bounds ? bounds : [[0, 0], [1, 1]]}/>

        {
          imgLoaded &&
          bounds && (
            <>
            <ImageOverlay url={image} bounds={bounds}/>
              <CreateSegment
                isCreateSegmentClicked={isCreateSegmentClicked}
                setIsCreateSegmentClicked={setIsCreateSegmentClicked}
                segmentList={segmentList}
                setSegmentList={setSegmentList}
                polyline={polyline}
                setPolyline={setPolyline}
                imageBounds={bounds}
              />
            </>
            )
        }

      </MapContainer>
    </Container>
  )
}

export default Map;