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
  components: Components;
  // circuitNodes: CircuitNodes;
  links: Links;
  sketch: Q5;
  hovered: string;
  mainSketch: HTMLElement | null;
  debug: boolean;
  height: number;
  width: number;
  canvas: HTMLElement;

  constructor() {
    // this.circuitNodes = useStore.getState().circuitNodes;
    this.components = useStore.getState().components;
    this.links = useStore.getState().links;

    this.sketch = new Q5();
    this.setupListeners();
    this.hovered = '';
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
    this.resetDraw();
    this.drawComponents();
    this.drawLinks();
  }

  drawComponents() {
    Object.keys(this.components).forEach((id) => {
      const component = this.components[id];
      component.draw();
    });
  }

  drawLinks() {
    Object.keys(this.links).forEach((id) => {
      const link = this.links[id];
      link.draw();
    });
  }

  resetDraw() {
    this.sketch.background('#242424');
    // ? NEED THIS TO RESET SET HOVERED ITEM. CONSIDER REFACTORING?
    this.sketch.cursor(this.sketch.ARROW);
    const setHovering = useStore.getState().setHovering;
    setHovering('');
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
        this.linkCircuitNodes(this.components[hovering], this.components[selected]);
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
        this.dragComponent(hovering);
      }
    }
  }

  addComponent() {
    const setMode = useStore.getState().setMode;
    const setSelectedComponent = useStore.getState().setSelectedComponent;
    const selectedComponent = useStore.getState().selectedComponent;

    const component = this.createComponent({ type: selectedComponent });
    if (component) {
      this.components[component.id] = component;
      // this.addNode(component);
      if (component.subnodes) {
        Object.keys(component.subnodes).forEach((key) => {
          const subnode = component.subnodes[key];
          this.components[subnode.id] = subnode;
          // this.addNode(subnode);
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
      // NOTE: ASSUMED LIGHT
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
  dragComponent(id: string) {
    const nextPos = this.vector(this.sketch.mouseX, this.sketch.mouseY);
    const component = this.components[id];
    component.drag(nextPos);
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

  // addNode(node: Battery | Light) {
  //   // todo: Use setNodes from store here?
  //   this.components[node.id] = node;
  // }

  addLink(link: CircuitLink) {
    // todo: use setLinks from store here?
    this.links[link.id] = link;
  }

  deleteLink(link: CircuitLink) {
    delete this.links[link.id];
  }

  deleteCircuitNode(circuitNode: CircuitNode) {
    Object.keys(circuitNode.links).forEach((key) => {
      const link = circuitNode.links[key];
      this.deleteLink(link);
    });
    delete this.components[circuitNode.id];
  }

  deleteComponent(id: string) {
    // in adddition to removing the node
    // we should tell the node to dispose itself?
    // actually we should check if this node
    // has subnodes and remove them
    const node = this.components[id];
    if (node.subnodes) {
      Object.keys(node.subnodes).forEach((sub) => {
        this.deleteCircuitNode(node.subnodes[sub]);
      });
    }
    delete this.components[id];
    this.selectNode('');
  }

  // todo: rather than linking circuit nodes, why not link
  // todo: components together and thats the circuit?
  linkCircuitNodes(node1: CircuitNode, node2: CircuitNode) {
    if (
      node1.hasLink(node2) ||
      node2.hasLink(node1) ||
      node1.parentNode.id === node2.parentNode.id
    ) {
      return;
    }
    // node1.link(node2);
    // node2.link(node1);
    const link = this.createLink({
      node1: node1,
      node2: node2,
    });
    node1.link(link);
    node2.link(link);

    this.addLink(link);
  }
}
