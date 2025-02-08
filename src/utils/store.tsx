import { create } from 'zustand';
import { modes } from './modes';
import { CircuitLink, Links } from '@/classes/CircuitLink/CircuitLink';
import { Node } from '@/classes/Node/Node';
import { Drawing } from '@/classes/Drawing/Drawing';
import { Component, Components } from '@/classes/Component/Component';
import { AlertColor } from '@mui/material';

interface State {
  drawing: Drawing | null;
  setDrawing: (val: Drawing) => void;
  selectedComponent: string;
  setSelectedComponent: (val: string) => void;

  selected: Node | null;
  setSelected: (node: Node | null) => void;
  hovering: string;
  setHovering: (val: string) => void;
  deleteSelectedComponent: () => void;
  components: Components;
  setComponents: (id: string, node: Node) => void;
  mode: string;
  setMode: (value: string) => void;

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
  drawing: null,
  setDrawing: (val: Drawing) => set(() => ({ drawing: val })),
  components: {},
  setComponents: () => set(() => ({})),
  links: {},
  setLinks: () => set(() => ({})),
  selected: null,
  setSelected: (node: Node | null) =>
    set(() => ({
      selected: node,
    })),
  deleteSelectedComponent: () => {
    // check the type of component we have.
    const drawing = get().drawing;
    const selected = get().selected;

    if (selected instanceof Component) {
      drawing?.deleteComponent(selected);
    } else if (selected instanceof CircuitLink) {
      drawing?.deleteLink(selected);
    }
  },
  mode: modes.SELECT,
  setMode: (value: string) =>
    set(() => {
      return {
        mode: value,
        selected: null,
      };
    }),

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
