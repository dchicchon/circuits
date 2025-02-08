import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import batteryIcon from '@/assets/battery.svg';
import lightIcon from '@/assets/light.svg';

import { useStore } from '@/utils/store';
import { useState } from 'react';
import { modes } from '@/utils/modes';
import { types } from '@/utils/types';

import styles from './SideMenu.module.css';

// use svgs instead?
const componentList = [
  {
    type: types.BATTERY,
    icon: batteryIcon,
  },
  {
    type: types.LIGHT,
    icon: lightIcon,
  },

  // TESTING ICON PLACEMENT
  {
    type: types.BATTERY,
    icon: batteryIcon,
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

function InspectComponent() {
  const selected = useStore((state) => state.selected);
  const deleteSelectedComponent = useStore((state) => state.deleteSelectedComponent);
  return (
    // consider creating columns or grid here?
    <Box sx={{ p: 1 }}>
      {!selected && <Typography variant="body2">No Selected Component</Typography>}
      {selected && (
        <>
          {/* <Typography variant="body2">Selected Component: {selected} </Typography> */}
          <Typography variant="body2"> Type: {selected.type} </Typography>
          {/* TODO: Show data for the selected component */}
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                deleteSelectedComponent();
              }}
              aria-label={'DeleteComponent'}
            >
              <DeleteIcon color={'inherit'} />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  );
}

function SideMenu() {
  const [menu, setMenu] = useState('components-list');

  // const mode = useStore((state) => state.mode);
  // const selected = useStore((state) => state.selected);
  return (
    <Paper
      elevation={5}
      sx={{
        userSelect: 'none',
        zIndex: 5,
        position: 'absolute',
        left: 25,
        top: 25,
        width: 250,
        height: 500,
      }}
    >
      <Box display="flex">
        <Paper
          elevation={menu === 'components-list' ? 0 : 5}
          sx={{
            p: 1,
            flex: 1,
            cursor: 'pointer',
          }}
          onClick={() => {
            setMenu('components-list');
          }}
        >
          <Typography variant="body1">Components</Typography>
        </Paper>

        <Paper
          elevation={menu === 'inspect-component' ? 0 : 5}
          sx={{
            p: 1,
            flex: 1,
            cursor: 'pointer',
          }}
          onClick={() => {
            setMenu('inspect-component');
          }}
        >
          <Typography variant="body1">Inspect</Typography>
        </Paper>
      </Box>
      <Box>
        {menu === 'components-list' && <ComponentsList />}
        {menu === 'inspect-component' && <InspectComponent />}
        {/* if components show that */}

        {/* if inspect show that*/}
      </Box>
    </Paper>
  );
}

export default SideMenu;
