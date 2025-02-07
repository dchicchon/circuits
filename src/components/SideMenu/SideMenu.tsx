import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';

import { useStore } from '@/utils/store';
import { useState } from 'react';
import { modes } from '@/utils/modes';
import { types } from '@/utils/types';

const componentList = [
  {
    type: types.BATTERY,
  },
  {
    type: types.LIGHT,
  },
  // {
  //   type: 'resistor',
  // },
];

interface CircuitComponentProps {
  type: string;
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
    <Paper
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      onClick={selectComponent}
      sx={{ p: 1, cursor: 'pointer' }}
      elevation={hover ? 10 : 5}
    >
      <Typography variant="body2">{props.type}</Typography>
    </Paper>
  );
}

// add multiple submenus for component inspect and
// creating components

function ComponentsList() {
  return (
    <Stack sx={{ p: 1 }} gap={2}>
      {componentList.map((comp, i) => (
        <CircuitComponent key={i} type={comp.type} />
      ))}
    </Stack>
  );
}

function InspectComponent() {
  const selected = useStore((state) => state.selected);
  const deleteNode = useStore((state) => state.deleteNode);
  return (
    // consider creating columns or grid here?
    <Box>
      <Typography>Inspect Component</Typography>
      {!selected && <Typography variant="body2">No Selected Component</Typography>}
      {selected && (
        <>
          <Typography variant="body2">Selected Component: {selected}</Typography>
          {/* delete button */}
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                deleteNode();
              }}
              aria-label={modes.CONNECT_CIRCUIT_NODE}
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
        width: 200,
      }}
    >
      <Box display="flex">
        <Typography
          sx={{
            border: '1px solid white',
            p: 1,
            flex: 1,
            cursor: 'pointer',
          }}
          onClick={() => {
            setMenu('components-list');
          }}
          variant="body1"
        >
          Components
        </Typography>
        <Typography
          sx={{
            border: '1px solid white',
            p: 1,
            flex: 1,
            cursor: 'pointer',
          }}
          onClick={() => {
            setMenu('inspect-component');
          }}
          variant="body1"
        >
          Inspect
        </Typography>
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
