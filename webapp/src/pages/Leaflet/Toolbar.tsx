import {Box, Button, ButtonGroup, Container, Grid, Typography} from "@material-ui/core";
import * as React from "react";
import {SetStateAction, useEffect} from "react";

type CanvasToolsProps = {
  onCreateSegmentClick: (event: React.MouseEvent) => void;
  isCreateSegmentClicked: boolean;
};

const Toolbar = ({onCreateSegmentClick, isCreateSegmentClicked}: CanvasToolsProps) => {


  return (
    <ButtonGroup
      orientation="vertical"
    >
      <Button
        variant={isCreateSegmentClicked ? "contained" : "outlined"}
        onClick={onCreateSegmentClick}
      >
        Créer un segment
      </Button>
    </ButtonGroup>
  );
}

export default Toolbar;