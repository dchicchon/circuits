import Q5 from '@/utils/qx5js';

import { Node, NodeProps } from '../Node/Node';
import { CircuitNode } from '../CircuitNode/CircuitNode';
import { useStore } from '@/utils/store';

export interface Components {
  [id: string]: Component;
}

interface SubNodes {
  [id: string]: CircuitNode;
}

export interface DataObject {
  value: number | string;
  type: 'enum-type' | 'number';
  name: string;
  units?: 'volts' | 'amps' | 'ohms';
  select?: Array<string>;
}

interface ComponentData {
  [id: string]: DataObject;
}

// todo: bypass this for now until we require new props
type ComponentProps = NodeProps;

// An electrical component should have subnodes
export abstract class Component extends Node {
  height: number;
  width: number;
  borderRadius: number;
  nodes: SubNodes;
  img: object;
  data: ComponentData;

  abstract drawSelf(): void;

  constructor(data: ComponentProps) {
    super(data);
    this.nodes = {};
    this.img = {};
    this.data = {};
    this.height = 0;
    this.width = 0;

    this.borderRadius = 10;
  }

  // todo: consider adding default draw function to all components?
  // todo: Make class method

  draw() {
    this.drawSelf();
  }

  setPos(pos: Q5.Vector) {
    this.pos = pos;
    // Object.keys(this.nodes).forEach((key) => {
    // this.nodes[key].updatePos();
    // });
  }

  // todo: Make class method
  drag(pos: Q5.Vector) {
    this.setPos(pos);
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
