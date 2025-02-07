import { Node, NodeProps } from '../Node/Node';
import { CircuitNode } from '../CircuitNode/CircuitNode';
import { useStore } from '@/utils/store';

export interface Components {
  [id: string]: Component;
}

interface SubNodes {
  [id: string]: CircuitNode;
}

interface ComponentProps extends NodeProps {}

// An electrical component should have subnodes
export class Component extends Node {
  height: number;
  width: number;
  borderRadius: number;
  subnodes: SubNodes;
  img: object;

  constructor(data: ComponentProps) {
    super(data);
    this.subnodes = {};
    this.img = {};
    this.height = 0;
    this.width = 0;
    this.borderRadius = 10;
  }

  // todo: consider adding default draw function to all components?
  draw() {}

  isHovering() {
    const mousePos = this.mousePos();
    return (
      mousePos.x > this.pos.x - this.width / 2 &&
      mousePos.x < this.pos.x + this.width / 2 &&
      mousePos.y > this.pos.y - this.height / 2 &&
      mousePos.y < this.pos.y + this.height / 2
    );
  }

  detectHover() {
    if (this.isHovering()) {
      this.sketch.cursor(this.sketch.HAND);
      const setHovering = useStore.getState().setHovering;
      setHovering(this.id);
    }
  }

  drawSelection() {
    const selected = useStore.getState().selected;
    if (this.id === selected) {
      this.sketch.push();
      this.sketch.noFill();
      this.sketch.rect(
        this.pos.x,
        this.pos.y,
        this.width + 20,
        this.height + 20,
        this.borderRadius
      );
      this.sketch.pop();
    }
  }
}
