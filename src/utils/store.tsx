import { create } from 'zustand';
import { Nodes, Node, Drawing } from './classes';
import { modes } from './modes';

interface State {
  drawing: Drawing | null;
  setDrawing: (val: Drawing) => void;
  selectedComponent: string;
  setSelectedComponent: (val: string) => void;
  selected: string;
  setSelected: (val: string) => void;
  deleteNode: () => void;
  nodes: Nodes;
  setNodes: (id: string, node: Node) => void;
  mode: string;
  setMode: (value: string) => void;

  // snackbar
  openBar: boolean;
  setOpenBar: (value: boolean) => void;
  message: string;
  severity: string;
  errorMessage: (value: string) => void;
  successMessage: (value: string) => void;
  closeMessage: () => void;
}

export const useStore = create<State>((set, get) => ({
  selectedComponent: '',
  setSelectedComponent: (val: string) => set(() => ({ selectedComponent: val })),
  drawing: null,
  setDrawing: (val: Drawing) => set(() => ({ drawing: val })),
  nodes: {},
  setNodes: () => set(() => ({})),
  selected: '',
  setSelected: (id: string) =>
    set(() => ({
      selected: id,
    })),
  deleteNode: () => {
    const drawing = get().drawing;
    const selected = get().selected;
    drawing?.deleteNode(selected);
    // delete an item on the drawing?
  },
  mode: modes.SELECT,
  setMode: (value: string) =>
    set(() => {
      return {
        mode: value,
        selected: '',
      };
    }),

  //   Messaging
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
