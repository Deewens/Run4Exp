import * as React from 'react';
import {Grid} from "@material-ui/core";
import Toolbar from "./Toolbar";
import Map from "./Map";
import {useState} from "react";
import ImageUpload from "./ImageUpload";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    height: '100vh',
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

  const [isCreateSegmentClicked, setIsCreateSegmentClicked] = useState<boolean>(false);

  const handleCreateSegmentClick = (e: React.MouseEvent) => {
    setIsCreateSegmentClicked(!isCreateSegmentClicked);
  }

  if (image) {
    return (
      <Grid container>
        <Grid item md={10}>
          <Map
            isCreateSegmentClicked={isCreateSegmentClicked}
            setIsCreateSegmentClicked={setIsCreateSegmentClicked}
            image={image}
          />
        </Grid>

        <Grid item className={classes.toolbar}>
          <Toolbar onCreateSegmentClick={handleCreateSegmentClick} isCreateSegmentClicked={isCreateSegmentClicked}/>
        </Grid>
      </Grid>
    )

  } else {
    return <ImageUpload setImage={setImage} />
  }
}

export default Leaflet;