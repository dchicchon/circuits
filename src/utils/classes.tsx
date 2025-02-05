import Q5 from 'q5xjs';
import { useStore } from '@/utils/store';
import { modes } from '@/utils/modes';
import { nanoid } from 'nanoid';

export interface Nodes {
  [id: string]: Circle | Rect;
}
interface NodeData {
  data: object;
  pos: Q5.Vector;
  drawType?: string;
}

interface CircleData extends NodeData {
  diameter: number;
}
interface RectData extends NodeData {
  width: number;
  height: number;
}
interface LineData extends NodeData {
  posNext: Q5.Vector;
  prev: Node;
  next: Node;
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
    this.setupListeners();
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
    this.sketch.rectMode(this.sketch.CENTER);
    this.sketch.stroke('white');
    this.sketch.strokeWeight(1);
  }

  draw() {
    this.sketch.background('#242424');
    this.drawSelectedComponent();
    this.drawNodes();
  }

  setupListeners() {
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
    this.sketch.keyPressed = () => {
      this.keyPressed();
    };
  }

  drawSelectedComponent() {
    const selectedComponent = useStore.getState().selectedComponent;
    if (selectedComponent) {
      const pos = this.mousePos();
      this.sketch.push();
      this.sketch.noFill();
      this.sketch.rect(pos.x, pos.y, 25, 25);
      this.sketch.pop();
      // draw a rect on the canvas where the mouse is
    }
  }

  keyPressed() {
    const mode = useStore.getState().mode;
    const setMode = useStore.getState().setMode;
    const setSelectedComponent = useStore.getState().setSelectedComponent;

    if (mode === modes.ADD_COMPONENT) {
      // 8 and 27
      const deletionCodes = [8, 27];
      const keyCode = this.sketch.keyCode;
      if (deletionCodes.includes(keyCode)) {
        setSelectedComponent('');
        setMode(modes.SELECT);
      }
    }
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
    } else if (mode === modes.CONNECT_CIRCUIT_NODE) {
      if (selected) {
        // connect the already selected node to the current hovered one
        this.linkCircuitNodes(this.nodes[this.hovered], this.nodes[selected]);
        this.selectNode('');
      } else if (this.hovered !== selected) {
        this.selectNode(this.hovered);
      }
    } else if (mode === modes.ADD_COMPONENT) {
      this.addComponent();
    }
  }

  addComponent() {
    const setMode = useStore.getState().setMode;
    const setSelectedComponent = useStore.getState().setSelectedComponent;
    const selectedComponent = useStore.getState().selectedComponent;

    // we need to add the text of the selected component
    // here somehow?
    const rect = new Rect({
      data: {
        type: selectedComponent,
      },
      pos: this.mousePos(),
      width: 24,
      height: 24,
    });
    this.addNode(rect);
    setMode(modes.SELECT);
    setSelectedComponent('');
  }

  mouseDragged() {
    const mode = useStore.getState().mode;
    // const selected = useStore.getState().selected;
    if (mode === modes.SELECT) {
      if (this.hovered) {
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
    // should a line be considered a node?
    // lets just draw it for now
    Object.keys(this.nodes).forEach((id) => {
      const node = this.nodes[id];
      if (node instanceof Circle) {
        this.sketch[node.drawType](node.pos.x, node.pos.y, node.diameter);
      } else if (node instanceof Line) {
        this.sketch[node.drawType](
          node.prev.pos.x,
          node.prev.pos.y,
          node.next.pos.x,
          node.next.pos.y
        );
      } else if (node instanceof Rect) {
        this.sketch[node.drawType](node.pos.x, node.pos.y, node.width, node.height);
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
        if (node instanceof Circle) {
          this.sketch[node.drawType](node.pos.x, node.pos.y, node.diameter + 15);
        } else if (node instanceof Rect) {
          this.sketch[node.drawType](
            node.pos.x,
            node.pos.y,
            node.width + 24,
            node.height + 24
          );
        }
        // draw selection around this
        this.sketch.pop();
      }
    });
  }

  isHovering(node: Node): boolean {
    const mousePos = this.mousePos();
    if (node instanceof Circle) {
      const dist = mousePos.dist(node.pos).toFixed(2);
      return dist < node.diameter / 2;
    } else if (node instanceof Rect) {
      return (
        mousePos.x > node.pos.x - node.width / 2 &&
        mousePos.x < node.pos.x + node.width / 2 &&
        mousePos.y > node.pos.y - node.height / 2 &&
        mousePos.y < node.pos.y + node.height / 2
      );
    }
    return false;
  }

  mousePos() {
    return this.sketch.createVector(this.sketch.mouseX, this.sketch.mouseY);
  }

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

  // todo: rather than linking circuit nodes, why not link
  // todo: components together and thats the circuit?
  linkCircuitNodes(node1: Node, node2: Node) {
    // rather than doing this lets
    // have our circuit nodes contain this information
    // since it may be more pertinent to them? not sure
    const line = new Line({
      pos: node1.pos,
      posNext: node2.pos,
      prev: node1,
      next: node2,
      drawType: 'line',
    });
    this.addNode(line);
  }
}

export class Node {
  pos: Q5.Vector;
  id: string;
  drawType: string;
  width?: number;
  height?: number;
  diameter?: number | null;

  constructor(data: NodeData) {
    this.id = nanoid();
    this.pos = data.pos;
    this.drawType = data.drawType;
  }
}

export class Circle extends Node {
  diameter: number;
  constructor(data: CircleData) {
    super({
      ...data,
      drawType: 'circle',
    });
    this.diameter = data.diameter;
  }
}

export class Line extends Node {
  prev: Node;
  next: Node;
  posNext: Q5.Vector;

  constructor(data: LineData) {
    super(data);
    this.prev = data.prev;
    this.next = data.next;
    this.posNext = data.next.pos;
  }
}

export class Rect extends Node {
  width: number;
  height: number;
  constructor(props: RectData) {
    super({
      ...props,
      drawType: 'rect',
    });
    this.width = props.width;
    this.height = props.height;
  }
}
