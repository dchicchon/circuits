import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Icon from '@mui/material/Icon';

import { types } from '@/utils/componentTypes';
import { modes } from '@/utils/modes';

import batteryIcon from '@/assets/battery.svg';
import resistorIcon from '@/assets/resistor.svg';
import lightIcon from '@/assets/light.svg';

import { useStore } from '@/utils/store';

import styles from './ComponentList.module.css';

// use svgs instead?
const componentList = [
  {
    type: types.BATTERY,
    icon: batteryIcon,
  },
  {
    type: types.RESISTOR,
    icon: resistorIcon,
  },
  {
    type: types.LIGHT,
    icon: lightIcon,
  },
];

interface CircuitComponentProps {
  type: string;
  icon: string;
}

function CircuitComponent(props: CircuitComponentProps) {
  const [hover, setHover] = useState(false);
  const setSelectedComponent = useStore((state) => state.setSelectedComponent);
  const setMode = useStore((state) => state.setMode);

  const selectComponent = () => {
    setSelectedComponent(props.type);
    setMode(modes.ADD_COMPONENT);
  };

  return (
    <Tooltip title={props.type}>
      <Paper
        sx={{
          minWidth: 75,
          maxWidth: 75,
          p: 2,
          mx: 1,
          cursor: 'pointer',
          flexGrow: 1,
          flex: 1,
        }}
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
        onClick={selectComponent}
        elevation={hover ? 15 : 5}
      >
        <Icon className={styles.iconRoot}>
          <img className={styles.icon} src={props.icon} />
        </Icon>
      </Paper>
    </Tooltip>
  );
}

function ComponentsList() {
  return (
    <Box sx={{ maxWidth: 250, p: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {componentList.map((comp, i) => (
        <CircuitComponent key={i} type={comp.type} icon={comp.icon} />
      ))}
    </Box>
  );
}

export default ComponentsList;
