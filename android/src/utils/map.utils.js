import React from 'react';
import { Polyline } from 'react-native-svg';
import Checkpoint from '../components/challenge/Checkpoint';
import { calculatePointCoordOnSegment } from './orthonormalCalculs';

export const useMapDrawing = (image,scale, checkpoints, segments, obstacles, checkpointSize, highlightSegmentId) => {

  if (image === undefined ||
    checkpoints === undefined ||
    segments === undefined ||
    obstacles === undefined) {
    return {};
  }

  if (image === null ||
    checkpoints === null ||
    segments === null ||
    obstacles === null) {
    return {};
  }

  const { imageWidth, imageHeight } = image;

  const biggestLenght = imageWidth > imageHeight ? imageWidth : imageHeight;

  const smalestLenght = imageWidth > imageHeight ? imageHeight : imageWidth;

  let calculY = (yCoord) => {
    return ((1 - yCoord) * biggestLenght) - (biggestLenght - smalestLenght);
  }

  let calculX = (xCoord) => {
    return xCoord * biggestLenght;
  }

  let getSegmentsPaths = () => {
    return segments.map(element => {
      return getSegmentPath(element);
    });
  }

  let getSegmentPath = (segment) => {
    let result = "";

    segment.coordinates.forEach(element => {
      let x = calculX(element.x);
      let y = calculY(element.y);
      result += `${x},${y} `
    });

    return (
      <Polyline key={segment.id} stroke={segment.id === highlightSegmentId ? '#44dd46' : '#3388ff'} strokeWidth="3" points={result} />
    );
  }

  let getCheckpointSvgs = () => {
    return checkpoints.map((checkpoint) => {
      let y = calculY(checkpoint.position.y);
      let x = calculX(checkpoint.position.x);
      let type = checkpoint.checkpointType;

      return (
        <Checkpoint
          y={y}
          x={x}
          type={type}
          key={checkpoint.id}
          size={checkpointSize} />
      );
    });
  }

  let getObstacles = () => {

    return obstacles.map((ob) => {

      let selectedSegment = segments.find(x => x.id === ob.segmentId);

      let roundedDistance = Math.round(((selectedSegment.length * ob.position) / 100) * 100);

      let val = calculatePointCoordOnSegment(selectedSegment, roundedDistance, scale);

      if (val == null) {
        return;
      }

      let x = calculX(val.x);
      let y = calculY(val.y);

      return (
        <Checkpoint
          y={y}
          x={x}
          type={'OBSTACLE'}
          key={ob.id}
          size={checkpointSize} />
      );
    });
  }

  return {
    checkpointList: getCheckpointSvgs(),
    segmentList: getSegmentsPaths(),
    obstacleList: getObstacles(),
  };

}
