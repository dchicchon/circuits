import { Q5, Vector } from 'q5xts';

import { Battery } from '../Components/Battery/Battery';
import { Light } from '../Components/Light/Light';
import { Resistor } from '../Components/Resistor/Resistor';

import { CircuitNode, CircuitNodes } from '../CircuitNode/CircuitNode';
import { CircuitLink, Links } from '../CircuitLink/CircuitLink';
import { Component, Components } from '../Components/Component';

import { useStore } from '@/utils/store';
import { modes } from '@/utils/modes';
import { types } from '@/utils/componentTypes';

interface createLinkProps {
  node1: CircuitNode;
  node2: CircuitNode;
}

interface createComponentProps {
  type: string;
}

// we should rerun our circuit calculations any time an action is done
// in our circuit board. Maybe we could add something to our store or in our drawing?
export class Drawing extends Q5 {
  components: Components;
  nodes: CircuitNodes;
  links: Links;
  hovered: string;
  debug: boolean;
  height: number;
  width: number;

  constructor(elm: HTMLElement) {
    super('', elm);
    this.components = useStore.getState().components;
    this.links = useStore.getState().links;
    this.nodes = useStore.getState().nodes;

    this.setupListeners();
    this.hovered = '';
    this.debug = true;
    this.height = document.body.clientHeight;
    this.width = document.body.clientWidth;
  }

  setupListeners() {
    this.draw = () => {
      this.resetDraw();
      this.drawLinks();
      this.drawComponents();
      const mode = useStore.getState().mode;
      if (mode !== modes.CONNECT_CIRCUIT_NODE) return;
      this.drawCircuitNodes();
    };

    this.setup = () => {
      this.frameRate(60);
      this.pixelDensity(window.devicePixelRatio);
      // @ts-expect-error assigned incorrectly. should fix this in package
      this.rectMode(this.CENTER);
      this.stroke('white');
      this.strokeWeight(1);
    };
    this.mouseClicked = () => {
      const mode = useStore.getState().mode;
      const hovering = useStore.getState().hovering;
      const selected = useStore.getState().selected;

      // todo make selected property specific to selected type/mode
      if (mode === modes.SELECT) {
        if (hovering !== selected) {
          this.selectNode(hovering);
        } else {
          // this.selectNode('');
        }
      } else if (mode === modes.CONNECT_CIRCUIT_NODE) {
        if (selected && hovering) {
          this.addLink(this.nodes[hovering], this.nodes[selected]);
          this.selectNode('');
        } else if (hovering !== selected) {
          this.selectNode(hovering);
        }
      } else if (mode === modes.ADD_COMPONENT) {
        this.addComponent();
      }
    };
    this.mouseDragged = () => {
      const mode = useStore.getState().mode;
      // only allow drag if dragged item is type component
      if (mode === modes.SELECT) {
        const hovering = useStore.getState().hovering;
        if (hovering) {
          this.dragComponent(hovering);
        }
      }
    };
    this.keyPressed = () => {
      const mode = useStore.getState().mode;
      const setMode = useStore.getState().setMode;
      const setSelectedComponent = useStore.getState().setSelectedComponent;

      if (mode === modes.ADD_COMPONENT) {
        const deletionCodes = [8, 27];
        const keyCode = this.keyCode;
        if (deletionCodes.includes(keyCode)) {
          setSelectedComponent('');
          setMode(modes.SELECT);
        }
      } else if (mode === modes.SELECT) {
        // Todo: unable to implement if user is
        // todo: editing value in inspect
        // const selected = useStore.getState().selected;
        // const deletionCodes = [8, 27];
        // const keyCode = this.keyCode;
        // if (deletionCodes.includes(keyCode)) {
        //   if (selected instanceof Component) {
        //     this.deleteComponent(selected);
        //   } else if (selected instanceof CircuitLink) {
        //     this.deleteLink(selected);
        //   }
        // }
      }
    };
  }

  drawComponents() {
    Object.keys(this.components).forEach((id) => {
      const component = this.components[id];
      component.draw();
    });
  }

  drawCircuitNodes() {
    Object.keys(this.nodes).forEach((id) => {
      const circuitNode = this.nodes[id];
      circuitNode.draw();
    });
  }

  drawLinks() {
    Object.keys(this.links).forEach((id) => {
      const link = this.links[id];
      link.draw();
    });
  }

  resetDraw() {
    this.background('#242424');
    const chunkNum = 25;
    const chunkWidth = this.width / chunkNum;
    // const chunkHeight = this.height / chunkNum;
    let x = 20;
    let y = 20;
    for (let i = 0; i < chunkNum * chunkNum; i++) {
      this.stroke('grey');
      this.strokeWeight(3);
      this.point(x, y);
      x += chunkWidth;
      if (x >= this.width) {
        x = 20;
        y += chunkWidth;
      }
    }
    // ? NEED THIS TO RESET SET HOVERED ITEM. CONSIDER REFACTORING?
    this.cursor(this.ARROW);
    const setHovering = useStore.getState().setHovering;
    setHovering('');
  }

  dragComponent(id: string) {
    const nextPos = this.vector(this.mouseX, this.mouseY);
    const component = this.components[id];
    if (component) {
      component.drag(nextPos);
    }
  }

  selectNode(id: string) {
    const setSelected = useStore.getState().setSelected;
    setSelected(id);
  }

  vector(x: number, y: number): Vector {
    return this.createVector(x, y);
  }

  mousePos() {
    return this.vector(this.mouseX, this.mouseY);
  }

  // CREATING
  createComponent(props: createComponentProps): Component {
    const defaultProps = {
      sketch: this,
      type: props.type,
      pos: this.mousePos(),
    };
    if (props.type === types.BATTERY) {
      return new Battery(defaultProps);
    } else if (props.type === types.RESISTOR) {
      return new Resistor(defaultProps);
    } else {
      return new Light(defaultProps);
    }
  }

  createLink(props: createLinkProps): CircuitLink {
    const defaultProps = {
      type: types.CIRCUIT_LINK,
      sketch: this,
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

  // ADDING
  addComponent() {
    const setMode = useStore.getState().setMode;
    const setSelectedComponent = useStore.getState().setSelectedComponent;
    const selectedComponent = useStore.getState().selectedComponent;
    const calculateCircuit = useStore.getState().calculateCircuit;

    const component = this.createComponent({ type: selectedComponent });
    this.components[component.id] = component;
    Object.keys(component.nodes).forEach((key) => {
      const subnode = component.nodes[key];
      this.nodes[subnode.id] = subnode;
    });

    setMode(modes.SELECT);
    setSelectedComponent('');
    calculateCircuit();
  }

  addLink(node1: CircuitNode, node2: CircuitNode) {
    if (
      node1.hasLink(node2) ||
      node2.hasLink(node1) ||
      node1.parentNode.id === node2.parentNode.id
    ) {
      // todo: show error message to user?
      return;
    }
    const link = this.createLink({
      node1: node1,
      node2: node2,
    });
    node1.link(link);
    node2.link(link);

    this.links[link.id] = link;
    const calculateCircuit = useStore.getState().calculateCircuit;
    calculateCircuit();
  }

  // DELETING
  deleteLink(link: CircuitLink) {
    const calculateCircuit = useStore.getState().calculateCircuit;
    link.removeNodes();
    delete this.links[link.id];
    calculateCircuit();
  }

  deleteCircuitNode(circuitNode: CircuitNode) {
    Object.keys(circuitNode.links).forEach((key) => {
      const link = circuitNode.links[key];
      this.deleteLink(link);
    });
    delete this.nodes[circuitNode.id];
  }

  deleteComponent(component: Component) {
    const calculateCircuit = useStore.getState().calculateCircuit;
    Object.keys(component.nodes).forEach((sub) => {
      this.deleteCircuitNode(component.nodes[sub]);
    });
    delete this.components[component.id];
    this.selectNode('');
    calculateCircuit();
  }
}
