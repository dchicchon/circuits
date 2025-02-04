import { useEffect } from 'react';
import { Drawing } from '@/utils/classes';
import { useStore } from '@/utils/store';

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

  return <div id="sketch"></div>;
}

export default CanvasComp;
