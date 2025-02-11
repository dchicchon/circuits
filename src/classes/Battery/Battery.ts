// import Q5 from '@/utils/qx5js';

import { NodeProps } from '../Node/Node';
import { Component } from '../Component/Component';
import { CircuitNode } from '../CircuitNode/CircuitNode';

import battery from '@/assets/battery.svg';

import { useStore } from '@/utils/store';
import { modes } from '@/utils/modes';
import { types } from '@/utils/componentTypes';

// todo: bypass this for now until we require new props
type BatteryProps = NodeProps;

export class Battery extends Component {
  constructor(data: BatteryProps) {
    super(data);
    this.nodes = {};
    this.width = 30;
    this.height = 75;
    this.img = this.sketch.loadImage(battery);

    this.data = {
      voltage: {
        name: 'Voltage',
        value: 10,
        type: 'number',
        units: 'volts',
      },
      currentType: {
        name: 'Current Type',
        value: 'AC',
        type: 'enum-type',
        select: ['AC', 'DC'],
      },
    };

    // TODO: Change the relative position on the component
    // TODO: so we don't have to rely on using const anode and cathode key names

    // this pos should be a relative pos
    // const cathodePos = this.vector(this.pos.x, this.pos.y - this.height / 2);
    const cathodePos = this.vector(0, this.height / -2);
    const anodePos = this.vector(0, this.height / 2);
    // const anodePos = this.vector(this.pos.x, this.pos.y + this.height / 2);
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
    this.sketch.image(this.img, this.pos.x - 25, this.pos.y - 25);
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
