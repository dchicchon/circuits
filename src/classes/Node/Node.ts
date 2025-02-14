import { Q5, Vector } from 'q5xts';
import { nanoid } from 'nanoid';

export interface NodeProps {
  sketch: Q5;
  pos: Vector;
  data?: object;
  type: string;
}

// todo: set pos to private property to avoid modification
export abstract class Node {
  sketch: Q5;
  pos: Vector;
  id: string;
  type: string;

  constructor(data: NodeProps) {
    this.id = nanoid();
    this.pos = data.pos;
    this.sketch = data.sketch;
    this.type = data.type;
  }

  vector(x: number, y: number): Vector {
    return this.sketch.createVector(x, y);
  }

  mousePos() {
    return this.vector(this.sketch.mouseX, this.sketch.mouseY);
  }
}
