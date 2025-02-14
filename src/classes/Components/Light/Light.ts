import { NodeProps } from '@/classes/Node/Node';
import { Component } from '@/classes/Components/Component';

import light from '@/assets/light.svg';

import { useStore } from '@/utils/store';
import { modes } from '@/utils/modes';

type LightProps = NodeProps;

export class Light extends Component {
  height: number;
  width: number;
  borderRadius: number;

  constructor(data: LightProps) {
    super(data);
    this.width = 30;
    this.height = 75;
    this.borderRadius = 10;
    this.data = {
      currentRating: {
        value: 0.02,
        name: 'Current Rating',
        type: 'number',
      },
      forwardVoltage: {
        value: 1.5,
        name: 'Forward Voltage',
        type: 'number',
      },
    };
    this.img = this.sketch.loadImage(light);

    this.addNode({
      type: 'anode',
      pos: this.vector(0, this.height / 2),
    });
    this.addNode({
      type: 'cathode',
      pos: this.vector(0, this.height / -2),
    });

    this.draw = () => {
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
    };
  }
}
