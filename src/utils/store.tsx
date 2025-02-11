import { create } from 'zustand';
import { modes } from './modes';
import { CircuitLink, Links } from '@/classes/CircuitLink/CircuitLink';
import { Node } from '@/classes/Node/Node';
import { Drawing } from '@/classes/Drawing/Drawing';
import { Components } from '@/classes/Components/Component';
import { AlertColor } from '@mui/material';
import { CircuitNode, CircuitNodes } from '@/classes/CircuitNode/CircuitNode';

interface State {
  drawing: Drawing | null;
  setDrawing: (val: Drawing) => void;
  selectedComponent: string;
  setSelectedComponent: (val: string) => void;

  selected: string;
  setSelected: (id: string) => void;
  hovering: string;
  setHovering: (val: string) => void;
  deleteSelectedComponent: () => void;

  mode: string;
  setMode: (value: string) => void;


  // calculate circuit value
  calculateCircuit: () => void;

  // COMPONENTS
  components: Components;
  setComponents: (id: string, node: Node) => void;

  // CIRCUIT_NODES
  nodes: CircuitNodes;
  setNodes: (id: string, node: CircuitNode) => void;

  // CIRCUIT_LINKS
  links: Links;
  setLinks: (id: string, link: CircuitLink) => void;

  // snackbar
  openBar: boolean;
  setOpenBar: (value: boolean) => void;
  message: string;
  severity: AlertColor;
  errorMessage: (value: string) => void;
  successMessage: (value: string) => void;
  closeMessage: () => void;
}

export const useStore = create<State>((set, get) => ({
  selectedComponent: '',
  setSelectedComponent: (val: string) => set(() => ({ selectedComponent: val })),
  hovering: '',
  setHovering: (val: string) => set(() => ({ hovering: val })),

  calculateCircuit() {
    console.log('calculating circuit');
    const components = get().components;
    const links = get().links;
    console.log({ components, links });
  },
  drawing: null,
  setDrawing: (val: Drawing) => set(() => ({ drawing: val })),
  selected: '',
  setSelected: (node: string) =>
    set(() => ({
      selected: node,
    })),
  deleteSelectedComponent: () => {
    // check the type of component we have.
    const drawing = get().drawing;
    const selected = get().selected;
    const components = get().components;
    const links = get().links;

    // lets check this instead?
    const component = components[selected];
    const link = links[selected];

    if (component) {
      drawing?.deleteComponent(component);
    } else if (link) {
      drawing?.deleteLink(link);
    }
  },
  mode: modes.SELECT,
  setMode: (value: string) =>
    set(() => ({
      mode: value,
      selected: '',
    })),

  // TODO: Update setting values
  components: {},
  setComponents: () => set(() => ({})),
  links: {},
  setLinks: () => set(() => ({})),
  nodes: {},
  setNodes: () => set(() => ({})),

  //   Messaging
  openBar: false,
  setOpenBar: (bool: boolean) => set(() => ({ openBar: bool })),
  message: '',
  severity: 'success',
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
