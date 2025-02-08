import { useEffect } from 'react';
import { useStore } from '@/utils/store';

import { Drawing } from '@/classes/Drawing/Drawing';

// import styles from './Canvas.module.css';

function CanvasComp() {
  const setDrawing = useStore((state) => state.setDrawing);
  useEffect(() => {
    const foundCanvas = document.getElementsByTagName('canvas');
    if (foundCanvas.length === 0) {
      const drawing = new Drawing();
      setDrawing(drawing);
    }
    return () => {
      const main = document.getElementById('main_sketch');
      if (main) {
        const [...children] = main.children;
        children.forEach((child) => {
          main.removeChild(child);
        });
      }
    };
  }, []);

  return <div id="main_sketch"></div>;
}

export default CanvasComp;
