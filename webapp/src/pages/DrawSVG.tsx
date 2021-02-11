import * as React from 'react';
import {SetStateAction, useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Box, Button, createStyles, Grid, Theme, Typography} from "@material-ui/core";
import SkyrimMap from "../images/maps/map_skyrim.jpg";
import {Line, pointed, Polyline, Svg, SVG} from '@svgdotjs/svg.js'

type Point = {
  x: number
  y: number
}


type LineCoords = {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
}

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

// X: 200
// Y: 300

// 200/1000 = 0.2
// 300/500 = 0.6

// Scale = 20
const Draw = () => {
  const [canDrawPath, setCanDrawPath] = useState(false);
  const [drawCheckpoint, setDrawCheckpoint] = useState(false);

  const handleDrawPathClicked = () => {
    setCanDrawPath(!canDrawPath);
  }

  const handleDrawCheckpointButton = () => {
    setDrawCheckpoint(!drawCheckpoint);
  }

  return (
    <Grid container>
      <Grid item md={10}>
        <MapCanvas
          canDrawPath={canDrawPath}
          setCanDrawPath={setCanDrawPath}
          drawCheckpoint={drawCheckpoint}
          setDrawCheckpoint={setDrawCheckpoint}
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
  drawCheckpoint: boolean,
  setDrawCheckpoint: (value: SetStateAction<boolean>) => void,
};

type Segment = {
  start: Point | null
  end: Point | null
  coords: Point[]
}

const MapCanvas = ({canDrawPath, setCanDrawPath, drawCheckpoint, setDrawCheckpoint}: MapCanvasProps) => {
  const classes = useStyles();

  const [draw, setDraw] = useState<Svg>(new Svg());

  // Données relatives au repère OIJ
  const [scale, setScale] = useState<number | null>(10);

  const [activeSegment, setActiveSegment] = useState<Segment>({start: null, end: null, coords: []});
  const [segmentList, setSegmentList] = useState<Segment[]>([]);

  // ==============================================================

  // Données relatives à l'affichage
  const [polyline, setPolyline] = useState<Polyline | null>(null);
  const [line, setLine] = useState<Line | null>(null);
  const [lineCoords, setLineCoords] = useState<LineCoords>({x1: 0, y1: 0, x2: 0, y2: 0});


  useEffect(() => {
    setDraw(SVG().addTo('#svg').size('100%', '100%'));
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

          line.remove();
        }

        const {x, y} = draw.point(e.clientX, e.clientY);

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

  const [checkpointList, setCheckpointList] = useState<Point[]>([]);
  // Add checkpoint on polyline
  useEffect(() => {
    if (drawCheckpoint) {
      if (polyline !== null) {
        setDrawCheckpoint(false);
        let polylineLastPoint = polyline.plot()[polyline.plot().length - 1];

        let circle = draw.circle(10).attr({x: polylineLastPoint[1], y: polylineLastPoint[0]})
        console.log(polylineLastPoint);
      }
    }
  });

  useEffect(() => {
    if (canDrawPath && line !== null) {
      draw.on('mouseup', (evtMouseUp: MouseEvent) => {
        if (evtMouseUp.button === 2) {
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
    <div id="svg" className={classes.svg} />
  );
}

type CanvasToolsProps = {
  onDrawPathClicked: (event: React.MouseEvent) => void,
  onDrawCheckpointClicked: (event: React.MouseEvent) => void
};

const CanvasTools = ({onDrawPathClicked, onDrawCheckpointClicked}: CanvasToolsProps) => {
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
            <Button variant="contained" onClick={onDrawCheckpointClicked}>Ajouter un point de passage</Button>
            <Button variant="contained">Ajouter un obstacle</Button>
            <Button variant="contained">Ajouter une intersection</Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

const calculatePxToOrthonormal(px: number) {

}