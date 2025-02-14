import { useEffect, useRef } from 'react';
import { useStore } from '@/utils/store';

import { Drawing } from '@/classes/Drawing/Drawing';

// import styles from './Canvas.module.css';

function CanvasComp() {
  const elm = useRef(null);
  const setDrawing = useStore((state) => state.setDrawing);
  const drawing = useStore((state) => state.drawing);
  useEffect(() => {
    const foundCanvas = document.getElementsByTagName('canvas');
    if (foundCanvas.length === 0) {
      const drawing = new Drawing(elm.current!);
      setDrawing(drawing);
    }
    return () => {
      if (drawing) {
        drawing.dispose();
      }
    };
  }, []);

  return <div ref={elm} id="main_sketch"></div>;
}

export default CanvasComp;
