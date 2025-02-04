import { useState, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
// import * as fabric from 'fabric';
// import { Canvas } from 'fabric';
import { useStore } from '../..//utils/store';
// import { useState } from 'react';
import Q5 from 'q5xjs';
import { modes } from '@/utils/modes';

interface Nodes {
  [id: string]: Node;
}
interface NodeData {
  pos: Q5.Vector;
  boundary: string;
  diameter?: number;
  width?: number;
  height?: number;
}

// our drawing should have
// knowledge of the mode
class Drawing {
  nodes: Nodes;
  sketch: Q5;
  hovered: string | null;
  selected: string | null;
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
    this.selected = null;
    this.hovered = null;
    this.nodes = {};
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
    this.sketch.frameRate(10);
    this.sketch.stroke('white');
    this.sketch.strokeWeight(1);
  }

  draw() {
    this.sketch.background('#242424');
    this.drawNodes();
  }

  mouseClicked() {
    const mode = useStore.getState().mode;
    if (mode === modes.SELECT) {
      if (this.hovered === this.selected) {
        console.log('setting to null');
        this.selected = null;
      } else if (this.hovered) {
        console.log('setting this to hovered');
        this.selected = this.hovered;
      } else {
        console.log('setting to null');
        this.selected = null;
      }
    } else if (mode === modes.ADD_CIRCUIT_NODE) {
      this.addCircuitNode(this.sketch.mouseX, this.sketch.mouseY);
    }
  }

  // we want to save our nodes in our store
  // todo: should nodes draw themselves? might be easier?
  drawNodes() {
    this.hovered = null;
    this.sketch.cursor(this.sketch.ARROW);
    Object.keys(this.nodes).forEach((id) => {
      const node = this.nodes[id];
      if (node.boundary === 'circle') {
        this.sketch[node.boundary](node.pos.x, node.pos.y, node.diameter);
      }
      if (node.boundary === 'rect') {
        this.sketch[node.boundary](node.pos.x, node.pos.y, node.width, node.height);
      }
      if (node.isHovered(this.sketch.mouseX, this.sketch.mouseY)) {
        this.hovered = node.id;
        this.sketch.cursor(this.sketch.HAND);
      }

      // todo: add dashed lines around this
      if (node.id === this.selected) {
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

  /**
   * A node can be selectable.
   * A node must have an assigned shape
   */
  addNode(node: Node) {
    this.nodes[node.id] = node;
  }

  createVector(x: number, y: number) {
    return this.sketch.createVector(x, y);
  }

  addCircuitNode(x: number, y: number) {
    const node = new Node({
      boundary: 'circle',
      pos: this.createVector(x, y),
      diameter: 25,
    });
    this.addNode(node);
  }
}

class Node {
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

/**
 *
 * Lets create dots around the canvas to help indicate distance
 * At what point should I just use q5js instead? somewhat simpler to
 * utilize here
 *
 */
function CanvasComp() {
  // send the canvas to the store
  // const canvasEl = useRef<HTMLCanvasElement>(null);
  // const setCanvas = useStore((state) => state.setCanvas);
  // const canvasAction = useStore((state) => state.canvasAction);
  const items = useStore((state) => state.items);

  useEffect(() => {
    const foundCanvas = document.getElementsByTagName('canvas');
    if (foundCanvas.length === 0) {
      const drawing = new Drawing();
    }
    // when we move to another tab, we should kill the sketch instance;
    return () => {
      const main = document.getElementById('main_sketch');
      if (main) {
        const [...children] = main.children;
        children.forEach((child) => {
          main.removeChild(child);
        });
      }
    };
  }, []);

  return <div id="sketch"></div>;
}

export default CanvasComp;
