import { Node, NodeProps } from '../Node/Node';
import { modes } from '@/utils/modes';
import { useStore } from '@/utils/store';

interface CircuitNodeProps extends NodeProps {
  parentNode: Node;
}

export class CircuitNode extends Node {
  // piece of a component that connects to the circuit
  diameter: number;
  parentNode: Node;

  // ? Does this need to contain a direct reference to other objects or just need ids?
  linked: Array<string>;
  // linked: Array<CircuitNode>;
  constructor(props: CircuitNodeProps) {
    super(props);
    this.diameter = 15;
    this.linked = [];
    this.parentNode = props.parentNode;
  }

  draw() {
    const mode = useStore.getState().mode;
    if (mode !== modes.CONNECT_CIRCUIT_NODE) return;
    this.sketch.push();
    this.sketch.strokeWeight(3);
    this.sketch.stroke('black');
    this.sketch.circle(this.pos.x, this.pos.y, this.diameter);
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

  isHovering() {
    const mousePos = this.mousePos();
    const dist = mousePos.dist(this.pos).toFixed(2);
    return dist < this.diameter / 2;
  }

  drawSelection() {
    const selected = useStore.getState().selected;
    if (this.id === selected) {
      this.sketch.push();
      this.sketch.strokeWeight(3);
      this.sketch.stroke('black');
      this.sketch.fill('orange');
      this.sketch.circle(this.pos.x, this.pos.y, this.diameter);
      this.sketch.pop();
    }
  }

  hasLink(node: CircuitNode) {
    return this.linked.some((link) => link === node.id);
  }

  //   add it to the list of connections
  link(node: CircuitNode) {
    this.linked.push(node.id);
  }
}
