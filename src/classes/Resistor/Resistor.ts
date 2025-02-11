// import Q5 from '@/utils/qx5js';

import { NodeProps } from '../Node/Node';
import { Component } from '../Component/Component';
import { CircuitNode } from '../CircuitNode/CircuitNode';

import resistorIcon from '@/assets/resistor.svg';

import { useStore } from '@/utils/store';
import { modes } from '@/utils/modes';
import { types } from '@/utils/componentTypes';

type ResistorProps = NodeProps;

export class Resistor extends Component {
  constructor(data: ResistorProps) {
    super(data);
    this.nodes = {};
    this.width = 30;
    this.height = 75;
    this.img = this.sketch.loadImage(resistorIcon);
    // TODO: should we include more stuff
    // TODO: like units?
    this.data = {
      resistance: {
        value: 100,
        type: 'number',
        name: 'Resistance',
        units: 'ohms',
      },
    };
    // TODO: Change the relative position on the component
    // TODO: so we don't have to rely on using const anode and cathode key names
    const cathodePos = this.vector(0, this.height / -2);
    const anodePos = this.vector(0, this.height / 2);

    const anode = new CircuitNode({
      electrodeType: 'anode',
      type: types.CIRCUIT_NODE,
      pos: anodePos,
      sketch: this.sketch,
      parentNode: this,
    });

    const cathode = new CircuitNode({
      electrodeType: 'cathode',
      type: types.CIRCUIT_NODE,
      pos: cathodePos,
      sketch: this.sketch,
      parentNode: this,
    });

    this.nodes.anode = anode;
    this.nodes.cathode = cathode;
  }

  drawSelf() {
    this.sketch.push();
    this.sketch.noFill();
    this.sketch.rect(this.pos.x, this.pos.y, this.width, this.height);
    this.sketch.image(
      this.img,
      this.pos.x - 18,
      this.pos.y - 20,
      this.width + 5,
      this.height - 35
    );
    this.sketch.pop();
    const mode = useStore.getState().mode;
    if (mode === modes.SELECT) {
      this.detectHover();
    }
    this.drawSelection();
  }

  // setPos(pos: Q5.Vector) {
  //   this.pos = pos;
  //   this.nodes.anode.pos = this.vector(this.pos.x, this.pos.y + this.height / 2);
  //   this.nodes.cathode.pos = this.vector(this.pos.x, this.pos.y - this.height / 2);
  // }

  // drag(pos: Q5.Vector) {
  //   this.setPos(pos);
  // }
}
