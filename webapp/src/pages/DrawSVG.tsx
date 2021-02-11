import * as React from 'react';
import {SetStateAction, useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Box, Button, createStyles, Grid, Theme, Typography} from "@material-ui/core";
import SkyrimMap from "../images/maps/map_skyrim.jpg";
import {Line, Polyline, Svg, SVG} from '@svgdotjs/svg.js'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    svg: {
      width: '1000px',
      height: '500px',
      backgroundImage: `url(${SkyrimMap})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    },
  })
);

const Draw = () => {
  const [canDrawPath, setCanDrawPath] = useState(false);
  const [drawCheckpointBtn, setDrawCheckpointBtn] = useState(false);

  const handleDrawPathClicked = () => {
    setCanDrawPath(!canDrawPath);
  }

  const handleDrawCheckpointButton = () => {
    setDrawCheckpointBtn(!drawCheckpointBtn);
  }

  return (
    <Grid container>
      <Grid item md={10}>
        <MapCanvas
          canDrawPath={canDrawPath}
          setCanDrawPath={setCanDrawPath}
          drawCheckpointBtn={drawCheckpointBtn}
          setDrawCheckpointBtn={setDrawCheckpointBtn}
        />
      </Grid>

      <Grid item md={2}>
        <CanvasTools
          onDrawPathClicked={handleDrawPathClicked}
          onDrawCheckpointClicked={handleDrawCheckpointButton}
        />
      </Grid>
    </Grid>
  );
}

export default Draw;

type MapCanvasProps = {
  canDrawPath: boolean,
  setCanDrawPath: (value: SetStateAction<boolean>) => void,
  drawCheckpointBtn: boolean,
  setDrawCheckpointBtn: (value: SetStateAction<boolean>) => void,
};

type LineCoords = {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
}

const MapCanvas = ({canDrawPath, setCanDrawPath}: MapCanvasProps) => {
  const classes = useStyles();

  const [draw, setDraw] = useState<Svg>(new Svg());

  const [polyline, setPolyline] = useState<Polyline | null>(null);
  const [line, setLine] = useState<Line | null>(null);
  const [lineCoords, setLineCoords] = useState<LineCoords>({x1: 0, y1: 0, x2: 0, y2: 0});

  const initSvg = () => {
    return SVG().addTo('#svg').size('100%', '100%');
  }

  useEffect(() => {
    setDraw(initSvg());
  }, []);

  useEffect(() => {
    let clickEvent = function (e: MouseEvent) {
      if (canDrawPath) {

        if (line !== null) {
          if (polyline === null) {
            let poly =
              draw.polyline([[lineCoords.x1, lineCoords.y1], [lineCoords.x2, lineCoords.y2]])
                .fill('none')
                .stroke({color: 'red', width: 5, linecap: 'round', linejoin: 'round'});
            setPolyline(poly);
          } else {
            let polyPoints = polyline.plot();
            polyline.plot([...polyPoints, [lineCoords.x1, lineCoords.y1], [lineCoords.x2, lineCoords.y2]])
          }

          //polyline = draw.polyline();
          line.remove();
        }

        const {x, y} = draw.point(e.clientX, e.clientY);
        //console.log(`X: ${x}`);
        //console.log(`Y: ${y}`);

        const newLine = draw.line(x, y, x, y);
        newLine.attr({
          stroke: "red",
          'stroke-width': 5
        });

        setLine(newLine);

        setLineCoords(({
          x1: x,
          y1: y,
          x2: x,
          y2: y,
        }))
      }
    };

    draw.on('click', clickEvent);

    return () => {
      draw.off('click');
    }
  })

  useEffect(() => {
    draw.on('mousemove', (e: MouseEvent) => {
      if (canDrawPath && line !== null) {
        const {x, y} = draw.point(e.clientX, e.clientY);
        line.attr({
          x2: x,
          y2: y,
        });

        setLineCoords(prevState => ({
          x1: prevState.x1,
          y1: prevState.y1,
          x2: x,
          y2: y,
        }));
      }

      if (canDrawPath && line === null && polyline !== null) {
        const {x, y} = draw.point(e.clientX, e.clientY);
        const newLine = draw.line(lineCoords.x1, lineCoords.y1, x, y);
        newLine.attr({
          stroke: "red",
          'stroke-width': 5
        });
        setLine(newLine);
      }
    });

    return () => {
      draw.off('mousemove');
    }
  })

  useEffect(() => {
    polyline?.on('mouseover', (e: MouseEvent) => {
      polyline?.attr({
        stroke: "black",
      });
    });

    polyline?.on('mouseout', (e: MouseEvent) => {
      polyline?.attr({
        stroke: "red",
      });
    });

    return () => {
      polyline?.off('mouseover');
      polyline?.off('mouseout');
    }
  });



  useEffect(() => {
    if (canDrawPath && line !== null) {
      draw.on('mouseup', (evtMouseUp: MouseEvent) => {
        if (evtMouseUp.button == 2) {
          draw.on('contextmenu', (evtContextMenu: MouseEvent) => {
            evtContextMenu.preventDefault();
          });

          line.remove();
          setLine(null);
          setCanDrawPath(false);
          console.log("right mouse fired");
        }
      })

      return () => {
        draw.off('mouseup');
      }
    }
  });

  return (
    <div id="svg" className={classes.svg}>
    </div>
  );
}

type CanvasToolsProps = {
  onDrawPathClicked: (event: React.MouseEvent) => void,
  onDrawCheckpointClicked: (event: React.MouseEvent) => void
};

const CanvasTools = ({onDrawPathClicked}: CanvasToolsProps) => {
  return (
    <div>
      <Grid container direction="column">
        <Grid item>
          <Typography variant="h3" align="center">
            Tools
          </Typography>
        </Grid>
        <Grid item>
          <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <Button variant="contained" onClick={onDrawPathClicked}>Draw a path</Button>
            <Button variant="contained">Ajouter un obstacle</Button>
            <Button variant="contained">Ajouter un point de passage</Button>
            <Button variant="contained">Ajouter une intersection</Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}