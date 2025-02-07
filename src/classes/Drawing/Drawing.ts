import Q5 from 'q5xjs';
import { useStore } from '@/utils/store';
import { Battery } from '../Battery/Battery';
import { Light } from '../Light/Light';
import { CircuitNode } from '../CircuitNode/CircuitNode';
import { CircuitLink, Links } from '../CircuitLink/CircuitLink';
import { Components } from '../Component/Component';
import { modes } from '@/utils/modes';
import { types } from '@/utils/types';

interface createLinkProps {
  node1: CircuitNode;
  node2: CircuitNode;
}

interface createComponentProps {
  type: string;
}

export class Drawing {
  nodes: Components;
  sketch: Q5;
  links: Links;
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
    this.links = useStore.getState().links;
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
    this.drawLinks();
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
    });
  }
  drawLinks() {
    Object.keys(this.links).forEach((id) => {
      const link = this.links[id];
      link.draw();
    });
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

  createComponent(props: createComponentProps): Battery | Light {
    const defaultProps = {
      sketch: this.sketch,
      type: props.type,
      pos: this.mousePos(),
    };
    if (props.type === types.BATTERY) {
      return new Battery(defaultProps);
    } else {
      // ASSUMED LIGHT
      return new Light(defaultProps);
    }
  }

  createLink(props: createLinkProps): CircuitLink {
    const defaultProps = {
      type: types.CIRCUIT_LINK,
      sketch: this.sketch,
      pos: this.mousePos(),
    };
    const { node1, node2 } = props;
    const link = new CircuitLink({
      ...defaultProps,
      node1,
      node2,
    });
    return link;
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

  addNode(node: Battery | Light) {
    // todo: Use setNodes from store here?
    this.nodes[node.id] = node;
  }

  addLink(link: CircuitLink) {
    // todo: use setLinks from store here?
    this.links[link.id] = link;
  }

  deleteNode(id: string) {
    delete this.nodes[id];
    this.selectNode('');
  }

  // todo: rather than linking circuit nodes, why not link
  // todo: components together and thats the circuit?
  linkCircuitNodes(node1: CircuitNode, node2: CircuitNode) {
    // check if links can connect with each other?
    // node1.link(node2);
    // node2.link(node1);
    const link = this.createLink({
      node1: node1,
      node2: node2,
    });
    this.addLink(link);
    // this.addNode(link);
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
