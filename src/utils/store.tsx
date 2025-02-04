import { create } from 'zustand';
import { Canvas, Circle, FabricObject, Point } from 'fabric';
// import * as fabric from 'fabric';
import { nanoid } from 'nanoid';
import { modes } from './modes';

/**
 * modes
 * select mode
 * create circuit node mode
 */

// a node is an item that is on the page
// interface Node {
//   type: string;
//   data: object;
//   canvasRef: FabricObject;
// }

interface State {
  selected: string | null;
  setSelected: (val: string) => void;
  deleteNode: () => void;
  items: object;
  setItem: (id, object) => void;
  addCircuitNode: (point: Point) => void;
  canvasAction: (mousePos: Point) => void;
  canvas: Canvas | null;
  setCanvas: (val: Canvas | null) => void;
  mode: string;
  setMode: (value: string) => void;
  openBar: boolean;
  setOpenBar: (value: boolean) => void;
  message: string;
  severity: string;
  errorMessage: (value: string) => void;
  successMessage: (value: string) => void;
  closeMessage: () => void;
}

export const useStore = create<State>((set, get) => ({
  canvas: null,
  items: {},
  setItem: () => set(() => ({})),
  setCanvas: (val: Canvas | null) => set(() => ({ canvas: val })),
  addCircuitNode: (mousePos: Point) =>
    set((state) => {
      if (state.canvas) {
        // const id = nanoid();
        // const node = {
        //   ref: new Circle({
        //     radius: 10,
        //     fill: 'white',
        //     top: mousePos.y,
        //     left: mousePos.x,
        //     id,
        //   }),
        // };

        // lets do our own thing
        // node.ref.on('mousedown:before', () => {
        //   console.log('selected node');
        //   // how do I add a ring around to
        //   // specify selection?
        //   //   state.setSelected(id);
        // });

        // node.ref.on('selected', () => {
        //   state.setSelected(id);
        // });

        // figure out how to add this to all
        // node.ref.setControlsVisibility({
        //   mt: false,
        //   mb: false,
        //   ml: false,
        //   mr: false,
        //   bl: false,
        //   br: false,
        //   tl: false,
        //   tr: false,
        //   mtr: false,
        // });
        state.canvas.add(node.ref);
        state.items[id] = node;
      }
      return {
        items: state.items,
      };
    }),
  connectCircuitNodes: () =>
    set((state) => {
      console.log('connect circuit nodes');
      return {};
    }),
  selected: null,
  setSelected: (id: string) =>
    set(() => ({
      selected: id,
    })),
  deleteNode: () =>
    set((state) => {
      const selected = state.selected;
      if (selected) {
        const list = state.canvas?.getActiveObjects();
        list?.forEach((node) => {
          delete state.items[node.id];
        });
        state.canvas.remove(...list);
        // node.ref.dispose();
        // delete state.items[selected];
      }
      return {
        items: state.items,
      };
    }),

  // do actions with the canvas
  canvasAction: (mousePos: Point) => {
    const mode = get().mode;
    const addCircuitNode = get().addCircuitNode;
    const setSelected = get().setSelected;
    // we should have an action tree to complete on the canvas
    switch (mode) {
      case modes.ADD_CIRCUIT_NODE:
        addCircuitNode(mousePos);
        // addCircuitNode(canvas, mousePos);
        break;
      case modes.SELECT:
        // console.log('select');
        break;
      case modes.CONNECT_CIRCUIT_NODE:
        console.log('connect circuit mode');
        break;
    }
  },
  mode: modes.SELECT,
  setMode: (value: string) => set(() => ({ mode: value })),

  openBar: false,
  setOpenBar: (bool: boolean) => set(() => ({ openBar: bool })),
  message: '',
  severity: '',
  errorMessage: (newMessage: string) =>
    set(() => ({
      openBar: true,
      message: newMessage,
      severity: 'error',
    })),
  successMessage: (newMessage: string) =>
    set(() => ({
      openBar: true,
      message: newMessage,
      severity: 'success',
    })),
  closeMessage: () => set(() => ({ message: '', openBar: false })),
}));
