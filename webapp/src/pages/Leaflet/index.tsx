import * as React from 'react';
import {Grid} from "@material-ui/core";
import Toolbar from "./Toolbar";
import Map from "./Map";
import {useState} from "react";

const Leaflet = () => {
  const [isCreateSegmentClicked, setIsCreateSegmentClicked] = useState<boolean>(false);

  const handleCreateSegmentClick = (e: React.MouseEvent) => {
    setIsCreateSegmentClicked(!isCreateSegmentClicked);
  }

  return (
    <Grid container>
      <Grid item md={10}>
        <Map isCreateSegmentClicked={isCreateSegmentClicked} setIsCreateSegmentClicked={setIsCreateSegmentClicked}/>
      </Grid>

      <Grid item>
        <Toolbar onCreateSegmentClick={handleCreateSegmentClick} isCreateSegmentClicked={isCreateSegmentClicked}/>
      </Grid>
    </Grid>
  )
}

export default Leaflet;