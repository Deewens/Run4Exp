import * as React from 'react';
import {Box, Container, Grid, Paper} from "@material-ui/core";
import Toolbar from "./Toolbar";
import Map from "./Map";
import {useState} from "react";
import ImageUpload from "./ImageUpload";
import {makeStyles} from "@material-ui/core/styles";
import SideSheet from "./SideSheet";

const useStyles = makeStyles({
  root: {
    width: '100%',
    margin: '0 auto',
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }
});

const Leaflet = () => {
  const classes = useStyles();

  const [image, setImage] = useState<string | null>(null);


  if (image) {
    return (

      <Box className={classes.root}>
        <Paper>
          <Box p={3}>
          <Map
            image={image}
          />
          </Box>
        </Paper>
        <SideSheet/>
        {/*<Grid item md={10}>*/}

        {/*</Grid>*/}

        {/*<Grid item className={classes.toolbar}>*/}
        {/*  <Toolbar onCreateSegmentClick={handleCreateSegmentClick} isCreateSegmentClicked={isCreateSegmentClicked}/>*/}
        {/*</Grid>*/}
      </Box>
    )

  } else {
    return <ImageUpload setImage={setImage}/>
  }
}

export default Leaflet;