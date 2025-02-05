import Q5 from 'q5xjs';
import { useStore } from '@/utils/store';
import { modes } from '@/utils/modes';
import { nanoid } from 'nanoid';

export interface Nodes {
  [id: string]: Node;
}
interface NodeData {
  pos: Q5.Vector;
  boundary: string;
  width?: number;
  height?: number;
}

interface CircleData extends NodeData {
  diameter: number;
}

export class Drawing {
  nodes: Nodes;
  sketch: Q5;
  hovered: string;
  mainSketch: HTMLElement | null;
  debug: boolean;
  height: number;
  width: number;
  canvas: HTMLElement;

  constructor() {
    this.sketch = new Q5();
    this.sketch.draw = () => {
      this.draw();
    };
    this.sketch.setup = () => {
      this.setup();
    };
    this.sketch.mouseClicked = () => {
      this.mouseClicked();
    };
    this.sketch.mouseDragged = () => {
      this.mouseDragged();
    };
    this.hovered = '';
    this.nodes = useStore.getState().nodes;
    this.mainSketch = document.getElementById('main_sketch');
    this.debug = true;
    this.height = document.body.clientHeight;
    this.width = document.body.clientWidth;
    this.canvas = this.sketch.createCanvas(this.width, this.height);
    this.sketch.pixelDensity(window.devicePixelRatio);
    if (this.mainSketch) {
      this.mainSketch.appendChild(this.canvas);
    }
  }

  setup() {
    // this.sketch.frameRate(10);
    this.sketch.stroke('white');
    this.sketch.strokeWeight(1);
  }

  draw() {
    this.sketch.background('#242424');
    this.drawNodes();
  }

  mouseClicked() {
    const mode = useStore.getState().mode;
    const selected = useStore.getState().selected;
    if (mode === modes.SELECT) {
      if (this.hovered !== selected) {
        this.selectNode(this.hovered);
      } else {
        // this.selectNode('');
      }
    } else if (mode === modes.ADD_CIRCUIT_NODE) {
      this.addCircuitNode(this.sketch.mouseX, this.sketch.mouseY);
    }
  }

  mouseDragged() {
    const mode = useStore.getState().mode;
    // const selected = useStore.getState().selected;
    if (mode === modes.SELECT) {
      if (this.hovered) {
        // this.selectNode(this.hovered);
        this.dragNode(this.hovered);
      }
    }
  }

  dragNode(id: string) {
    this.nodes[id].pos = this.vector(this.sketch.mouseX, this.sketch.mouseY);
  }

  selectNode(id: string) {
    const setSelected = useStore.getState().setSelected;
    setSelected(id);
  }

  // we want to save our nodes in our store
  // todo: should nodes draw themselves? might be easier?
  drawNodes() {
    this.hovered = '';
    this.sketch.cursor(this.sketch.ARROW);
    Object.keys(this.nodes).forEach((id) => {
      const node = this.nodes[id];
      if (node.boundary === 'circle') {
        this.sketch[node.boundary](node.pos.x, node.pos.y, node.diameter);
      }
      if (node.boundary === 'rect') {
        this.sketch[node.boundary](node.pos.x, node.pos.y, node.width, node.height);
      }
      if (this.isHovering(node)) {
        this.hovered = node.id;
        this.sketch.cursor(this.sketch.HAND);
      }
      // todo: add dashed lines around this
      const selected = useStore.getState().selected;
      if (node.id === selected) {
        this.sketch.push();
        this.sketch.noFill();
        if (node.boundary === 'circle') {
          this.sketch[node.boundary](node.pos.x, node.pos.y, node.diameter + 15);
        }
        // draw selection around this
        this.sketch.pop();
      }
    });
  }

  isHovering(node: Node): boolean {
    const mousePos = this.mousePos();
    if (node.boundary === 'circle') {
      const dist = mousePos.dist(node.pos).toFixed(2);
      if (dist < node.diameter / 2) {
        return true;
      }
    }
    return false;
  }

  mousePos() {
    return this.sketch.createVector(this.sketch.mouseX, this.sketch.mouseY);
  }

  /**
   * A node can be selectable.
   * A node must have an assigned shape
   */
  addNode(node: Node) {
    this.nodes[node.id] = node;
  }

  deleteNode(id: string) {
    delete this.nodes[id];
    this.selectNode('');
  }

  vector(x: number, y: number) {
    return this.sketch.createVector(x, y);
  }

  addCircuitNode(x: number, y: number) {
    const node = new Node({
      boundary: 'circle',
      pos: this.vector(x, y),
      diameter: 25,
    });
    this.addNode(node);
  }
}

export class Node {
  pos: Q5.Vector;
  id: string;
  boundary: string;
  width?: number;
  height?: number;
  diameter?: number | null;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;

  constructor(data: NodeData) {
    this.id = nanoid();
    this.pos = data.pos;
    this.boundary = data.boundary;
    if (this.boundary === 'circle' && data.diameter) {
      this.diameter = data.diameter;
      this.minX = this.pos.x - data.diameter / 2;
      this.minY = this.pos.y - data.diameter / 2;
      this.maxX = this.pos.x + data.diameter / 2;
      this.maxY = this.pos.y + data.diameter / 2;
    } else {
      this.minX = this.pos.x;
      this.minY = this.pos.y;
      this.maxX = this.pos.x + data.width;
      this.maxY = this.pos.y + data.height;
    }
  }

  isHovered(mouseX: number, mouseY: number): boolean {
    // this is a dynamic thing we should check
    if (
      mouseX > this.minX &&
      mouseX < this.maxX &&
      mouseY > this.minY &&
      mouseY < this.maxY
    ) {
      return true;
    }
    return false;
  }
}

export class Circle extends Node {
  diameter: number;

  constructor(data: CircleData) {
    super(data);
    this.diameter = data.diameter;
  }
}
