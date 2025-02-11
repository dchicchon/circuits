// import Q5 from '@/utils/qx5js';

import { NodeProps } from '../../Node/Node';
import { Component } from '../Component';

import { useStore } from '@/utils/store';
import { modes } from '@/utils/modes';

import battery from '@/assets/battery.svg';

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

    this.addNode({
      type: 'anode',
      pos: this.vector(0, this.height / 2),
    });
    this.addNode({
      type: 'cathode',
      pos: this.vector(0, this.height / -2),
    });
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
}
