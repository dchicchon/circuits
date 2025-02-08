import Q5 from 'q5xjs';

import { Node, NodeProps } from '../Node/Node';
import { CircuitNode } from '../CircuitNode/CircuitNode';
import { useStore } from '@/utils/store';

export interface Components {
  [id: string]: Component;
}

interface SubNodes {
  [id: string]: CircuitNode;
}

interface DataObject {
  value: number | string;
  type: 'enum-type' | 'number';
  name: string;
  units?: 'volts' | 'amps' | 'ohms';
  select?: Array<string>;
}

interface ComponentData {
  [id: string]: DataObject;
}

interface ComponentProps extends NodeProps {}

// An electrical component should have subnodes
export class Component extends Node {
  height: number;
  width: number;
  borderRadius: number;
  subnodes: SubNodes;
  img: object;
  data: ComponentData;

  constructor(data: ComponentProps) {
    super(data);
    this.subnodes = {};
    this.img = {};
    this.data = {};
    this.height = 0;
    this.width = 0;

    this.borderRadius = 10;
  }

  // todo: consider adding default draw function to all components?
  // todo: Make class method
  draw() {}

  // todo: Make class method
  drag(arg: Q5.Vector) {
    console.log(arg);
  }

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
    if (this.id === selected?.id) {
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
