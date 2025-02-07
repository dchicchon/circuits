import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
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
function SideMenu() {
  // const mode = useStore((state) => state.mode);
  // const selected = useStore((state) => state.selected);
  return (
    <Paper
      elevation={5}
      sx={{
        userSelect: 'none',
        zIndex: 5,
        p: 2,
        position: 'absolute',
        left: 25,
        top: 25,
        width: 200,
      }}
    >
      <Typography variant="h6">Components</Typography>
      <Stack gap={2}>
        {componentList.map((comp, i) => (
          <CircuitComponent key={i} type={comp.type} />
        ))}
      </Stack>
    </Paper>
  );
}

export default SideMenu;
