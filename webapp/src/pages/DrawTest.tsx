import * as React from 'react';
import {fabric} from "fabric";
import {useCallback, useEffect, useState} from "react";
import {Canvas, IEvent} from "fabric/fabric-impl";

const Draw = () => {
  const [canvas, setCanvas] = useState<Canvas>(new fabric.Canvas(null));
  const [isDrawButtonClicked, setDrawButtonClicked] = useState(false);
  const [lines, setLines] = useState<Array<fabric.Line>>([]);
  const [lineCounter, setLineCounter] = useState<number>(0);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const initCanvas = () => {
    let can = new fabric.Canvas('canvas', {
      height: 800,
      width: 800,
      backgroundColor: 'pink'
    })

    return can;
  };

  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  useEffect(() => {
    canvas.on('mouse:down', options => {
      if (isDrawButtonClicked) {
        console.log("Canvas mouse down");
        canvas.selection = false;
        setStartingPoint(options);
        let points = [x, y, x, y];

        let line = new fabric.Line(
          points,
          {
            strokeWidth: 3,
            selectable: false,
            stroke: 'red',
          });

        setLines(prevState => [...prevState, line]);

        canvas.add(line);
        setLineCounter(lineCounter + 1);
        canvas.on('mouse:up', options => {
          canvas.selection = true;
        })
      } else {
        console.log("button false");
      }
    });
    return function cleanup() {
      canvas.off('mouse:down');
      canvas.off('mouse:up');
    }
  });

  useEffect(() => {
    canvas.on('mouse:move', options => {
      if (lines[0] !== null && lines[0] !== undefined && isDrawButtonClicked) {
        setStartingPoint(options);
        lines[lineCounter - 1].set({
          x2: x,
          y2: y
        });

        canvas.renderAll();
      }
    });

    return () => {
      canvas.off('mouse:move');
    }
  })

  const setStartingPoint = (options: IEvent) => {
    if (options.pointer?.x) {
      setX(options.pointer.x);
      console.log("X: " + options.pointer.x);
    } else {
      setX(0);
      console.log("X: 0");
    }
    if (options.pointer?.y) {
      setY(options.pointer.y);
      console.log("Y: " + options.pointer.y);
    } else {
      setY(0);
      console.log("Y: 0");
    }
  }

  return (
    <div>
      <button onClick={() => setDrawButtonClicked(!isDrawButtonClicked)}>Draw</button>
      <canvas id="canvas"/>
    </div>
  );
}

export default Draw;