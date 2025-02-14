import resistorIcon from '@/assets/resistor.svg';

import { NodeProps } from '@/classes/Node/Node';
import { Component } from '@/classes/Components/Component';

import { useStore } from '@/utils/store';
import { modes } from '@/utils/modes';

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

    this.addNode({
      pos: this.vector(0, this.height / 2),
    });
    this.addNode({
      pos: this.vector(0, this.height / -2),
    });

    this.draw = () => {
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
    };
  }
}
