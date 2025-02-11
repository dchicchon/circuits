import { CircuitNode } from '../CircuitNode/CircuitNode';
import { NodeProps, Node } from '../Node/Node';

import { useStore } from '@/utils/store';
export interface Links {
  [id: string]: CircuitLink;
}

interface CircuitLinkProps extends NodeProps {
  node1: CircuitNode;
  node2: CircuitNode;
}

export class CircuitLink extends Node {
  node1: CircuitNode;
  node2: CircuitNode;
  diameter: number;
  voltage: number;
  current: number;

  constructor(props: CircuitLinkProps) {
    super(props);
    this.node1 = props.node1;
    this.node2 = props.node2;
    this.diameter = 10;
    this.voltage = 0;
    this.current = 0;
  }

  get midpoint() {
    const node1Pos = this.node1.getPos();
    const node2Pos = this.node2.getPos();
    const midx = (node1Pos.x + node2Pos.x) / 2;
    const midy = (node1Pos.y + node2Pos.y) / 2;
    return this.vector(midx, midy);
  }

  draw() {
    this.sketch.push();

    const node1Pos = this.node1.getPos();
    const node2Pos = this.node2.getPos();
    this.sketch.line(node1Pos.x, node1Pos.y, node2Pos.x, node2Pos.y);
    this.sketch.circle(this.midpoint.x, this.midpoint.y, this.diameter);
    this.detectHover();
    this.sketch.pop();
    this.drawSelection();
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
      // this.sketch.strokeWeight(3);
      this.sketch.stroke('orange');
      this.sketch.fill('orange');
      this.sketch.circle(this.midpoint.x, this.midpoint.y, this.diameter);
      this.sketch.pop();
    }
  }

  isHovering() {
    const mousePos = this.mousePos();
    const dist = mousePos.dist(this.midpoint).toFixed(2);
    return dist < this.diameter / 2;
  }

  removeNodes() {
    this.node1.deleteLink(this);
    this.node2.deleteLink(this);
  }
}
