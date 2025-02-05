import Q5 from 'q5xjs';
import { useStore } from '@/utils/store';
import { modes } from '@/utils/modes';
import { nanoid } from 'nanoid';

export interface Nodes {
  [id: string]: Light | Battery | CircuitNode | Link;
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

  setup() {
    // this.sketch.frameRate(10);
    this.sketch.rectMode(this.sketch.CENTER);
    this.sketch.stroke('white');
    this.sketch.strokeWeight(1);
  }

  draw() {
    this.sketch.background('#242424');
    this.drawNodes();
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
    const hovering = useStore.getState().hovering;
    const selected = useStore.getState().selected;
    if (mode === modes.SELECT) {
      if (hovering !== selected) {
        this.selectNode(hovering);
      } else {
        // this.selectNode('');
      }
    } else if (mode === modes.CONNECT_CIRCUIT_NODE) {
      if (selected && hovering) {
        this.linkCircuitNodes(this.nodes[hovering], this.nodes[selected]);
        this.selectNode('');
      } else if (hovering !== selected) {
        this.selectNode(hovering);
      }
    } else if (mode === modes.ADD_COMPONENT) {
      this.addComponent();
    }
  }

  mouseDragged() {
    const mode = useStore.getState().mode;
    if (mode === modes.SELECT) {
      const hovering = useStore.getState().hovering;
      if (hovering) {
        this.dragNode(hovering);
      }
    }
  }

  addComponent() {
    const setMode = useStore.getState().setMode;
    const setSelectedComponent = useStore.getState().setSelectedComponent;
    const selectedComponent = useStore.getState().selectedComponent;

    const component = this.createComponent({ type: selectedComponent });
    if (component) {
      this.addNode(component);
      if (component.subnodes) {
        Object.keys(component.subnodes).forEach((key) => {
          const subnode = component.subnodes[key];
          this.addNode(subnode);
        });
      }
      // we should be adding it's subnodes too
    }

    setMode(modes.SELECT);
    setSelectedComponent('');
  }

  createComponent(props: object): Battery | Light | Link | undefined {
    const defaultProps = {
      sketch: this.sketch,
      type: props.type,
      pos: this.mousePos(),
    };
    if (props.type === 'battery') {
      const battery = new Battery({
        ...defaultProps,
        pos: this.mousePos(),
      });
      return battery;
    } else if (props.type === 'light') {
      const light = new Light({
        ...defaultProps,
        pos: this.mousePos(),
      });
      return light;
    } else if (props.type === 'link') {
      const link = new Link({
        ...defaultProps,
        ...props,
      });
      return link;
    }
  }

  // todo: only some components could be dragged?
  dragNode(id: string) {
    const nextPos = this.vector(this.sketch.mouseX, this.sketch.mouseY);
    const node = this.nodes[id];
    node.drag(nextPos);
  }

  selectNode(id: string) {
    const setSelected = useStore.getState().setSelected;
    setSelected(id);
  }

  vector(x: number, y: number): Q5.Vector {
    return this.sketch.createVector(x, y);
  }

  mousePos() {
    return this.vector(this.sketch.mouseX, this.sketch.mouseY);
  }
  drawNodes() {
    // this.hovered = '';
    this.sketch.cursor(this.sketch.ARROW);
    const setHovering = useStore.getState().setHovering;
    setHovering('');
    // should a line be considered a node?
    // lets just draw it for now
    Object.keys(this.nodes).forEach((id) => {
      const node = this.nodes[id];
      node.draw();
      //   if (this.isHovering(node)) {
      // this.hovered = node.id;
      // this.sketch.cursor(this.sketch.HAND);
      //   }
    });

    // if nothing hovered, then set to false?
  }

  addNode(node: Node | Battery | Light | Link) {
    this.nodes[node.id] = node;
  }

  deleteNode(id: string) {
    delete this.nodes[id];
    this.selectNode('');
  }

  // todo: rather than linking circuit nodes, why not link
  // todo: components together and thats the circuit?
  linkCircuitNodes(node1: CircuitNode, node2: CircuitNode) {
    // node1.link(node2);
    // node2.link(node1);
    const link = this.createComponent({ type: 'link', node1: node1, node2: node2 });
    console.log(link);
    this.addNode(link);
    // we should create a new node that links
    // these two circuit nodes together?
    // this link should be selectable?

    // rather than doing this lets
    // have our circuit nodes contain this information
    // since it may be more pertinent to them? not sure
    // const line = new Line({
    //   pos: node1.pos,
    //   posNext: node2.pos,
    //   prev: node1,
    //   next: node2,
    //   drawType: 'line',
    // });
    // this.addNode(line);
  }
}

interface NodeProps {
  data?: object;
  pos: Q5.Vector;
  sketch: Q5;
  type: string;
}
export class Node {
  sketch: Q5;
  pos: Q5.Vector;
  id: string;
  type: string;

  constructor(data: NodeProps) {
    this.id = nanoid();
    this.pos = data.pos;
    this.sketch = data.sketch;
    this.type = data.type;
  }

  vector(x: number, y: number): Q5.Vector {
    return this.sketch.createVector(x, y);
  }

  mousePos() {
    return this.vector(this.sketch.mouseX, this.sketch.mouseY);
  }
}
interface BatteryProps extends NodeProps {
  sketch: Q5;
}

interface SubNodes {
  [id: string]: CircuitNode;
}

class Battery extends Node {
  subnodes: SubNodes;
  //   anode: CircuitNode;
  //   cathode: CircuitNode;
  height: number;
  width: number;
  borderRadius: number;
  // contains 2 connection sides. Anode and Cathode
  constructor(data: BatteryProps) {
    super(data);
    this.subnodes = {};
    this.width = 30;
    this.height = 75;
    this.borderRadius = 10;

    const anodePos = this.vector(this.pos.x, this.pos.y - this.height / 2);
    const cathodePos = this.vector(this.pos.x, this.pos.y + this.height / 2);
    const anode = new CircuitNode({
      pos: anodePos,
      sketch: this.sketch,
      parentNode: this,
    });
    this.subnodes.anode = anode;
    const cathode = new CircuitNode({
      pos: cathodePos,
      sketch: this.sketch,
      parentNode: this,
    });
    this.subnodes.cathode = cathode;
  }
  draw() {
    // anode should be located at top of battery and bottom?
    this.sketch.rect(this.pos.x, this.pos.y, this.width, this.height);
    const mode = useStore.getState().mode;
    if (mode === modes.CONNECT_CIRCUIT_NODE) {
      //   Object.keys(this.subnodes).forEach((key) => {
      // const node = this.subnodes[key];
      // node.draw();
      //   });
    }
    if (mode === modes.SELECT) {
      this.detectHover();
    }
    this.drawSelection();
  }

  detectHover() {
    if (this.isHovering()) {
      this.sketch.cursor(this.sketch.HAND);
      const setHovering = useStore.getState().setHovering;
      setHovering(this.id);
    }
  }

  setPos(pos: Q5.Vector) {
    this.pos = pos;
    this.subnodes.anode.pos = this.vector(this.pos.x, this.pos.y - this.height / 2);
    this.subnodes.cathode.pos = this.vector(this.pos.x, this.pos.y + this.height / 2);
  }

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

class Light extends Node {
  subnodes: SubNodes;
  height: number;
  width: number;
  borderRadius: number;
  constructor(data: NodeProps) {
    super(data);
    this.subnodes = {};
    this.width = 30;
    this.height = 75;
    this.borderRadius = 10;
    const anodePos = this.vector(this.pos.x, this.pos.y - this.height / 2);
    const cathodePos = this.vector(this.pos.x, this.pos.y + this.height / 2);
    const anode = new CircuitNode({
      pos: anodePos,
      sketch: this.sketch,
      parentNode: this,
    });
    this.subnodes.anode = anode;
    const cathode = new CircuitNode({
      pos: cathodePos,
      sketch: this.sketch,
      parentNode: this,
    });
    this.subnodes.cathode = cathode;
  }

  draw() {
    // anode should be located at top of battery and bottom?
    this.sketch.rect(this.pos.x, this.pos.y, this.width, this.height);
    const mode = useStore.getState().mode;
    if (mode === modes.SELECT) {
      this.detectHover();
    }
    this.drawSelection();
  }

  detectHover() {
    if (this.isHovering()) {
      this.sketch.cursor(this.sketch.HAND);
      const setHovering = useStore.getState().setHovering;
      setHovering(this.id);
    }
  }

  setPos(pos: Q5.Vector) {
    this.pos = pos;
    this.subnodes.anode.pos = this.vector(this.pos.x, this.pos.y - this.height / 2);
    this.subnodes.cathode.pos = this.vector(this.pos.x, this.pos.y + this.height / 2);
  }

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

interface CircuitNodeProps extends NodeProps {
  parentNode: Node;
}
class CircuitNode extends Node {
  // piece of a component that connects to the circuit
  diameter: number;
  parentNode: Node;
  linked: Array<CircuitNode>;
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

  //   add it to the list of connections
  link(node: CircuitNode) {
    // when linking, lets make sure to not link
    // to a circuit node with the same parent
    if (node.parentNode.id === this.parentNode.id) return;
  }
}

interface LinkProps extends NodeProps {
  node1: CircuitNode;
  node2: CircuitNode;
}
class Link extends Node {
  node1: CircuitNode;
  node2: CircuitNode;

  constructor(props: LinkProps) {
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
