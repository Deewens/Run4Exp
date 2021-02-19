// import {SetStateAction, useEffect, useState, useCallback} from "react";
// import {Line, Polyline, SVG, Svg} from "@svgdotjs/svg.js";
// import {Dimension, LineCoords, Point, Segment} from "@acrobatt";
// import {
//   calculateDistanceBetweenPoint,
//   calculateOrthonormalDimension,
//   calculateOrthonormalPoint
// } from "../../../../../../backup/src/utils/orthonormalCalculs";
// import * as React from "react";
// import {makeStyles} from "@material-ui/core/styles";
// import {Container, createStyles, Theme} from "@material-ui/core";
// import SkyrimMap from "../../images/maps/map_skyrim.jpg";
//
// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     svg: {
//       width: '1000px',
//       height: '500px',
//       backgroundImage: `url(${SkyrimMap})`,
//       backgroundPosition: 'center',
//       backgroundSize: 'cover',
//     },
//   })
// );
//
// const useDrawCheckpoint = () => {
//
// }
//
// type MapCanvasProps = {
//   canCreateSegment: boolean,
//   setCanCreateSegment: (value: SetStateAction<boolean>) => void,
//   drawCheckpoint: boolean,
//   setDrawCheckpoint: (value: SetStateAction<boolean>) => void,
// };
//
// const MapCanvas = ({canCreateSegment, setCanCreateSegment, drawCheckpoint, setDrawCheckpoint}: MapCanvasProps) => {
//   const classes = useStyles();
//
//   const [draw, setDraw] = useState<Svg>(new Svg()); // Container element for drawing SVG elements
//
//   // Données relatives au repère OIJ
//   const [scale, setScale] = useState<number>(100); // Scale of the map in km
//
//   const [activeSegmentStartPoint, setActiveSegmentStartPoint] = useState<Point | null>(null);
//   const [activeSegmentEndPoint, setActiveSegmentEndPoint] = useState<Point | null>(null);
//   const [activeSegment, setActiveSegment] = useState<Segment>({start: null, end: null, coords: []});
//   const [segmentList, setSegmentList] = useState<Segment[]>([]);
//
//   const [orthonormalDimension, setOrthonormalDimension] = useState<Dimension | null>(null);
//
//   // ==============================================================
//
//   // Données relatives à l'affichage
//   const [polyline, setPolyline] = useState<Polyline | null>(null);
//   const [line, setLine] = useState<Line | null>(null);
//   const [lineCoords, setLineCoords] = useState<LineCoords>({x1: 0, y1: 0, x2: 0, y2: 0});
//
//   const [svgDimension, setSvgDimension] = useState<Dimension>({width: 1000, height: 500});
//
//
//   useEffect(() => {
//     setOrthonormalDimension(calculateOrthonormalDimension(svgDimension.width, svgDimension.height));
//
//     setDraw(SVG().addTo('#svg').size('100%', '100%'));
//   }, []);
//
//   let onMouseClick = useCallback((e: MouseEvent) => {
//     if (canCreateSegment) {
//       console.log("can create segment");
//     }
//   }, [canCreateSegment]);
//
//   useEffect(() => {
//     draw.on('click', onMouseClick);
//     return () => {
//       draw.off('click');
//     };
//   }, [draw, onMouseClick]);
//
//   // Create start point
//   useEffect(() => {
//     if (canCreateSegment) {
//       if (activeSegmentStartPoint === null) {
//         console.log("Placez le point de départ du segment.");
//
//         let circle = draw.circle(25);
//         draw.on('mousemove', (e: MouseEvent) => {
//           const {x, y} = draw.point(e.clientX, e.clientY);
//           circle.move(x, y);
//         });
//
//         draw.on('click', (e: MouseEvent) => {
//           const {x, y} = draw.point(e.clientX, e.clientY);
//
//           setActiveSegmentStartPoint({x, y});
//           draw.off('mousemove');
//         })
//       }
//
//       if (activeSegmentStartPoint !== null && activeSegmentEndPoint === null) {
//         console.log("Placez le point d'arrivé du segment.");
//
//         let circle = draw.circle(25);
//         draw.on('mousemove', (e: MouseEvent) => {
//           const {x, y} = draw.point(e.clientX, e.clientY);
//           circle.move(x, y);
//         });
//
//         draw.on('click', (e: MouseEvent) => {
//           const {x, y} = draw.point(e.clientX, e.clientY);
//
//           setActiveSegmentEndPoint({x, y});
//           draw.off('mousemove');
//         })
//       }
//     }
//
//     return () => {
//       draw.off('mousemove');
//       draw.off('click');
//     }
//   }, [canCreateSegment, activeSegmentStartPoint, activeSegmentEndPoint])
//
//   /*useEffect(() => {
//     console.log(JSON.stringify(orthonormalDimension));
//   }, [orthonormalDimension]);
//
//   useEffect(() => {
//     let clickEvent = function (e: MouseEvent) {
//       if (canCreateSegment) {
//         if (line !== null) {
//           if (polyline === null) {
//             let poly =
//               draw.polyline([[lineCoords.x1, lineCoords.y1], [lineCoords.x2, lineCoords.y2]])
//               .fill('none')
//               .stroke({color: 'red', width: 5, linecap: 'round', linejoin: 'round'});
//             setPolyline(poly);
//           } else {
//             let polyPoints = polyline.plot();
//             polyline.plot([...polyPoints, [lineCoords.x1, lineCoords.y1], [lineCoords.x2, lineCoords.y2]])
//           }
//
//           line.remove();
//
//           if (orthonormalDimension) {
//             let p1 = calculateOrthonormalPoint({
//               x: lineCoords.x1,
//               y: lineCoords.y1
//             }, svgDimension, orthonormalDimension);
//             let p2 = calculateOrthonormalPoint({
//               x: lineCoords.x2,
//               y: lineCoords.y2
//             }, svgDimension, orthonormalDimension);
//             let distance = calculateDistanceBetweenPoint(
//               p1,
//               p2,
//               scale
//             );
//
//             console.log("distance: " + JSON.stringify(distance));
//           }
//         }
//
//         const {x, y} = draw.point(e.clientX, e.clientY);
//
//         const newLine = draw.line(x, y, x, y);
//         newLine.attr({
//           stroke: "red",
//           'stroke-width': 5
//         });
//
//         setLine(newLine);
//
//         setLineCoords(({
//           x1: x,
//           y1: y,
//           x2: x,
//           y2: y,
//         }))
//       }
//     };
//
//     draw.on('click', clickEvent);
//
//     return () => {
//       draw.off('click');
//     }
//   })
//
//   useEffect(() => {
//     draw.on('mousemove', (e: MouseEvent) => {
//       if (canCreateSegment && line !== null) {
//         const {x, y} = draw.point(e.clientX, e.clientY);
//         line.attr({
//           x2: x,
//           y2: y,
//         });
//
//         setLineCoords(prevState => ({
//           x1: prevState.x1,
//           y1: prevState.y1,
//           x2: x,
//           y2: y,
//         }));
//       }
//
//       if (canCreateSegment && line === null && polyline !== null) {
//         const {x, y} = draw.point(e.clientX, e.clientY);
//         const newLine = draw.line(lineCoords.x1, lineCoords.y1, x, y);
//         newLine.attr({
//           stroke: "red",
//           'stroke-width': 5
//         });
//         setLine(newLine);
//       }
//     });
//
//     return () => {
//       draw.off('mousemove');
//     }
//   })
//
//   const [checkpointList, setCheckpointList] = useState<Point[]>([]);
//   // Add checkpoint on polyline
//   useEffect(() => {
//     if (drawCheckpoint) {
//       if (polyline !== null) {
//         setDrawCheckpoint(false);
//         let polylineLastPoint = polyline.plot()[polyline.plot().length - 1];
//
//         let circle = draw.circle(10).attr({x: polylineLastPoint[1], y: polylineLastPoint[0]})
//         console.log(polylineLastPoint);
//       }
//     }
//   });
//
//   useEffect(() => {
//     if (canCreateSegment && line !== null) {
//       draw.on('mouseup', (evtMouseUp: MouseEvent) => {
//         if (evtMouseUp.button === 2) {
//           draw.on('contextmenu', (evtContextMenu: MouseEvent) => {
//             evtContextMenu.preventDefault();
//           });
//
//           line.remove();
//           setLine(null);
//           setCanCreateSegment(false);
//           console.log("right mouse fired");
//         }
//       })
//
//       return () => {
//         draw.off('mouseup');
//       }
//     }
//   });
//
//   useEffect(() => {
//     if (orthonormalDimension) {
//       draw.on('mousedown', (e: MouseEvent) => {
//
//         const {x, y} = draw.point(e.clientX, e.clientY);
//         console.log(`Real XY(${x}, ${y})`);
//
//         const orthonormalPoint = calculateOrthonormalPoint({x, y}, svgDimension, orthonormalDimension);
//         console.log(`Orthonormal XY(${orthonormalPoint.x}, ${orthonormalPoint.y})`);
//       });
//     }
//
//     return () => {
//       draw.off('mousedown');
//     }
//   }); */
//
//   return (
//     /*<Container>
//       <div id="svg" className={classes.svg}/>
//       {
//         points.map(p => <Point draw={draw} point={p} onClick={(e) => { onPointClick(e, p); }}>)
//       }
//     </Container>*/
//     null
//   );
// }
//
// export default MapCanvas;

export {}