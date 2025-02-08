interface Modes {
  [id: string]: string;
}

export const modes: Modes = {
  SELECT: 'SELECT',
  CONNECT_CIRCUIT_NODE: 'CONNECT_CIRCUIT_NODE',
  ADD_COMPONENT: 'ADD_COMPONENT',
  MULTIMETER: 'MULTIMETER',
};
