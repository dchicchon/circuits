import Q5 from '@/utils/qx5js';

import { nanoid } from 'nanoid';

export interface NodeProps {
  sketch: Q5;
  pos: Q5.Vector;
  data?: object;
  type: string;
}


// todo: set pos to private property to 
// todo cont. avoid modification
export abstract class Node {
  sketch: Q5;
  pos: Q5.Vector;
  id: string;
  type: string;

  constructor(data: NodeProps) {
    this.id = nanoid();
    this.pos = data.pos;
    this.sketch = data.sketch;
    this.type = data.type;
  }

  vector(x: number, y: number): Q5.Vector {
    return this.sketch.createVector(x, y);
  }

  mousePos() {
    return this.vector(this.sketch.mouseX, this.sketch.mouseY);
  }
}
