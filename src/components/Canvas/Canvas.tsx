import { useState, useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import { Canvas } from 'fabric';
import { useStore } from '../..//utils/store';
// import { useState } from 'react';
import Q5 from 'q5xjs'

// class Drawing {

// }

/**
 *
 * Lets create dots around the canvas to help indicate distance
 * At what point should I just use q5js instead? somewhat simpler to
 * utilize here
 *
 */
function CanvasComp() {
  // send the canvas to the store
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const setCanvas = useStore((state) => state.setCanvas);
  const canvasAction = useStore((state) => state.canvasAction);
  const items = useStore((state) => state.items);

  // consider just using qx5js. might be more of a headache? idk

  useEffect(() => {
    if (canvasEl.current) {
      // should be the width and height of window?
      const height = window.innerHeight;
      const width = window.innerWidth;
      const initCanvas = new Canvas(canvasEl.current, {
        width,
        height,
      });
      initCanvas.on('mouse:up', (e) => {
        canvasAction(e.scenePoint);
      });
      setCanvas(initCanvas);
      return () => {
        initCanvas.dispose();
        setCanvas(null);
      };
    }
  }, []);

  return <canvas ref={canvasEl} />;
}

export default CanvasComp;
