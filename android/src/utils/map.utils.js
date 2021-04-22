import React from 'react';
import {Polyline} from 'react-native-svg';
import Checkpoint from '../components/challenge/Checkpoint';
import {calculateOrthonormalDimension} from '../utils/orthonormalCalculs'

export const useMapDrawing = (image, checkpoints, segments) => {

  if (image === null ||
    checkpoints === null ||
    segments === null) {
    return {};
  }

  const orthonomal = calculateOrthonormalDimension(image.imageWidth,image.imageHeight);

  let calculY = (yCoord) => {
    
    return ((1 - yCoord) * 1.3 - 0.33) * (image.imageHeight)
  }

  let calculX = (xCoord) => {
    return xCoord * image.imageWidth;
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
      <Polyline key={segment.id} stroke="#3388ff" strokeWidth="3" points={result} />
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
          key={checkpoint.id} />
      );
    });
  }

  return {
    checkpointList: getCheckpointSvgs(),
    segmentList: getSegmentsPaths()
  };

}
