import Q5 from 'q5xjs';

import { NodeProps } from '../Node/Node';
import { CircuitNode } from '../CircuitNode/CircuitNode';
import { Component } from '../Component/Component';

import light from '@/assets/light.svg';

import { useStore } from '@/utils/store';
import { modes } from '@/utils/modes';
import { types } from '@/utils/types';

export class Light extends Component {
  height: number;
  width: number;
  borderRadius: number;

  constructor(data: NodeProps) {
    super(data);
    this.width = 30;
    this.height = 75;
    this.borderRadius = 10;
    this.img = this.sketch.loadImage(light);
    const anodePos = this.vector(this.pos.x, this.pos.y - this.height / 2);
    const cathodePos = this.vector(this.pos.x, this.pos.y + this.height / 2);
    const anode = new CircuitNode({
      type: types.CIRCUIT_NODE,
      pos: anodePos,
      sketch: this.sketch,
      parentNode: this,
    });
    this.subnodes.anode = anode;
    const cathode = new CircuitNode({
      type: types.CIRCUIT_NODE,
      pos: cathodePos,
      sketch: this.sketch,
      parentNode: this,
    });
    this.subnodes.cathode = cathode;
  }

  draw() {
    this.sketch.push();
    this.sketch.noFill();
    // anode should be located at top of battery and bottom?
    this.sketch.rect(this.pos.x, this.pos.y, this.width, this.height);
    this.sketch.image(this.img, this.pos.x - 25, this.pos.y - 25);
    this.sketch.pop();
    const mode = useStore.getState().mode;
    if (mode === modes.SELECT) {
      this.detectHover();
    }
    this.drawSelection();
  }

  setPos(pos: Q5.Vector) {
    this.pos = pos;
    this.subnodes.anode.pos = this.vector(this.pos.x, this.pos.y - this.height / 2);
    this.subnodes.cathode.pos = this.vector(this.pos.x, this.pos.y + this.height / 2);
  }

  drag(pos: Q5.Vector) {
    this.setPos(pos);
  }
}
