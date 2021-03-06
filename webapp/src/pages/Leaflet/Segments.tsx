import * as React from 'react';
import {Segment} from "@acrobatt";
import {SetStateAction, useState} from "react";
import L, {LatLng, LatLngExpression, LeafletMouseEvent} from "leaflet";
import {Circle, CircleMarker, Polyline} from 'react-leaflet';
import TextPath from "react-leaflet-textpath";
import {Menu, MenuItem, PopoverPosition} from "@material-ui/core";

type Props = {
  segmentList: Segment[]
  setSegmentList: (value: SetStateAction<Segment[]>) => void
  setAddCheckpoint: (value: SetStateAction<LatLng | null>) => void
}

const Segments = (props: Props) => {
  const {
    segmentList,
    setSegmentList,
    setAddCheckpoint
  } = props;

  const [openMenu, setOpenMenu] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<PopoverPosition>({top: 0, left: 0});

  const [segmentClickEvent, setSegmentClickEvent] = useState<LeafletMouseEvent | null>(null);

  const [hintMarkerCenter, setHintMarkerCenter] = useState<LatLngExpression | null>(null);


  const handleEndpointClick = (segment: Segment) => {
    console.log("click");
  }

  const handleSegmentClick = (e: LeafletMouseEvent, segment: Segment) => {
    //console.log(e.latlng);
    L.DomEvent.stopPropagation(e);

    let polyline: L.Polyline = e.target;
    console.log(polyline.getCenter());
    setSegmentClickEvent(e);

    let x = e.originalEvent.clientX;
    let y = e.originalEvent.clientY;
    setAnchorPosition({top: y, left: x});
    setOpenMenu(true);
  }

  const handleAddCheckpoint = () => {
    if (segmentClickEvent) {
      let polyline: L.Polyline = segmentClickEvent.target;
      //let latLng = L.latLng(hintMarkerCenter);
      setAddCheckpoint(segmentClickEvent.latlng);
      setOpenMenu(false);
    }
  }

  const handleCloseMenu = () => {
    setOpenMenu(false);
  }

  return (
    <>
      {
        segmentList.map((segment, i, array) => {
          let latLngStart = L.latLng(segment.start.y, segment.start.x);
          let latLngEnd = L.latLng(segment.end.y, segment.end.x);
          let coords: LatLng[] = segment.coords.map((coord) => {
            return L.latLng(coord.y, coord.x);
          });

          let polyline: LatLngExpression[] = [latLngStart, ...coords, latLngEnd];

          let endpoints = (
            <>
              <CircleMarker
                center={latLngStart}
                pathOptions={{color: 'black'}}
                radius={5}
                eventHandlers={{
                  click: () => handleEndpointClick(segment)
                }}
              />
              <CircleMarker
                center={latLngEnd}
                pathOptions={{color: 'red'}}
                radius={5}
                eventHandlers={{
                  click: () => handleEndpointClick(segment)
                }}
              />
            </>
          )

          return (
            <div key={i}>
              {endpoints}
              <Polyline
                positions={polyline}
                eventHandlers={{
                  click: (e: LeafletMouseEvent) => handleSegmentClick(e, segment),
                  mousemove: (e: LeafletMouseEvent) => {
                    //setHintMarkerCenter(e.latlng);
                  },
                  mouseout: (e: LeafletMouseEvent) => {
                    //setHintMarkerCenter(null);
                  }
                }}
              />
              {hintMarkerCenter && <CircleMarker
                center={hintMarkerCenter}
                pathOptions={{color: 'red'}}
                radius={8}
              />}
            </div>
          );
        })
      }

      <Menu
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        id="simple-menu"
        keepMounted
        open={openMenu}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleAddCheckpoint}>Ajouter une intersection</MenuItem>
        <MenuItem onClick={handleCloseMenu}>Supprimer le segment</MenuItem>
      </Menu>
    </>
  );
}

export default Segments;