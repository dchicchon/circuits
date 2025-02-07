import { CircuitNode } from '../CircuitNode/CircuitNode';
import { NodeProps, Node } from '../Node/Node';

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

  constructor(props: CircuitLinkProps) {
    super(props);
    this.node1 = props.node1;
    this.node2 = props.node2;
  }

  draw() {
    // draw a line from node1 to node2
    this.sketch.push();
    this.sketch.line(
      this.node1.pos.x,
      this.node1.pos.y,
      this.node2.pos.x,
      this.node2.pos.y
    );
    this.sketch.pop();
  }
}
