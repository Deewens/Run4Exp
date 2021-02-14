import * as React from 'react';
import { useState } from 'react';
import {Grid } from '@material-ui/core';
import MapCanvas from "./MapCanvas";
import Toolbar from "./Toolbar";

const Draw = () => {
  const [canDrawPath, setCanCreateSegment] = useState(false);
  const [drawCheckpoint, setDrawCheckpoint] = useState(false);

  const handleCreateSegmentButton = () => {
    setCanCreateSegment(!canDrawPath);
  }

  const handleDrawCheckpointButton = () => {
    setDrawCheckpoint(!drawCheckpoint);
  }

  return (
    <Grid container direction="column" justifyContent="center">
      <Grid item md={10}>
        <MapCanvas
          canCreateSegment={canDrawPath}
          setCanCreateSegment={setCanCreateSegment}
          drawCheckpoint={drawCheckpoint}
          setDrawCheckpoint={setDrawCheckpoint}
        />
      </Grid>

      <Grid item md={2}>
        <Toolbar
          onCreateSegmentClicked={handleCreateSegmentButton}
          onDrawCheckpointClicked={handleDrawCheckpointButton}
        />
      </Grid>
    </Grid>
  );
}

export default Draw;