import { Node, NodeProps } from '../Node/Node';
import { CircuitLink } from '../CircuitLink/CircuitLink';

import { modes } from '@/utils/modes';
import { useStore } from '@/utils/store';

// should circuit nodes have a type as well? like anode,cathode?
export interface CircuitNodes {
  [id: string]: CircuitNode;
}

interface CircuitNodeProps extends NodeProps {
  parentNode: Node;
  electrodeType: 'anode' | 'cathode';
}

interface Links {
  [id: string]: CircuitLink;
}

export class CircuitNode extends Node {
  // CATHODE - positive
  // ANODE - negative
  electrodeType: 'anode' | 'cathode';
  diameter: number;
  parentNode: Node;

  // ? Does this need to contain a direct reference to other objects or just need ids?
  // linked: Array<string>;
  // linked: Array<CircuitNode>;
  links: Links;
  constructor(props: CircuitNodeProps) {
    super(props);
    this.diameter = 15;
    this.links = {};
    this.electrodeType = props.electrodeType;
    this.parentNode = props.parentNode;
  }

  draw() {
    const mode = useStore.getState().mode;
    if (mode !== modes.CONNECT_CIRCUIT_NODE) return;
    this.sketch.push();
    this.sketch.strokeWeight(3);
    this.sketch.stroke('black');
    this.sketch.circle(this.pos.x, this.pos.y, this.diameter);
    if (this.electrodeType === 'anode') {
      this.sketch.text('--', this.pos.x - 4, this.pos.y + 3);
    } else {
      this.sketch.text('+', this.pos.x - 4, this.pos.y + 3);
    }
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

  isHovering(): boolean {
    const mousePos = this.mousePos();
    const dist = mousePos.dist(this.pos).toFixed(2);
    return dist < this.diameter / 2;
  }

  drawSelection() {
    const selected = useStore.getState().selected;
    if (this.id === selected?.id) {
      this.sketch.push();
      this.sketch.strokeWeight(3);
      this.sketch.stroke('black');
      this.sketch.fill('orange');
      this.sketch.circle(this.pos.x, this.pos.y, this.diameter);
      this.sketch.pop();
    }
  }

  hasLink(node: CircuitNode): boolean {
    // for all links, check the links to see what nodes
    // are connected
    // todo: better yet do we need to have the linked nodes references here?
    // todo: or do we just need the links?

    return Object.keys(this.links).some((key) => {
      const link = this.links[key];
      return link.node1.id === node.id || link.node2.id === node.id;
    });
    // return this.links.some((link) => {
    //   return link.node1.id === node.id || link.node2.id === node.id;
    // });
    // return this.linked.some((link) => link === node.id);
  }

  deleteLink(removedLink: CircuitLink) {
    delete this.links[removedLink.id];
  }

  link(link: CircuitLink) {
    this.links[link.id] = link;
  }
}
