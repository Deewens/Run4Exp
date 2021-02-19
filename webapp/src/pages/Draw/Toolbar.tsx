import {Box, Button, Container, Grid, Typography} from "@material-ui/core";
import * as React from "react";

type CanvasToolsProps = {
  onCreateSegmentClicked: (event: React.MouseEvent) => void,
  onDrawCheckpointClicked: (event: React.MouseEvent) => void
};

const Toolbar = ({onCreateSegmentClicked, onDrawCheckpointClicked}: CanvasToolsProps) => {
  return (
    <Container maxWidth="md">
      <Grid container direction="column">
        <Grid item>
          <Typography variant="h3" align="center">
            Tools
          </Typography>
        </Grid>
        <Grid item>
          <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>

            <Button variant="contained" onClick={onCreateSegmentClicked}>Créer un segment</Button>
            <Button variant="contained" onClick={onDrawCheckpointClicked}>Ajouter un point de passage</Button>
            <Button variant="contained">Ajouter un obstacle</Button>
            <Button variant="contained">Ajouter une intersection</Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Toolbar;