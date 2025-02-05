import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { useStore } from '@/utils/store';

const componentList = [
  {
    type: 'battery',
  },
  {
    type: 'light',
  },
  {
    type: 'resistor',
  },
];

interface CircuitComponentProps {
  type: string;
}

function CircuitComponent(props: CircuitComponentProps) {
  const selectComponent = () => {};

  return (
    <Paper onClick={selectComponent} sx={{ p: 1, cursor: 'pointer' }} elevation={5}>
      <Typography variant="body2">{props.type}</Typography>
    </Paper>
  );
}

// add multiple submenus for component inspect and
// creating components
function SideMenu() {
  const mode = useStore((state) => state.mode);
  const selected = useStore((state) => state.selected);
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
        {componentList.map((comp) => (
          <CircuitComponent type={comp.type} />
        ))}
      </Stack>
    </Paper>
  );
}

export default SideMenu;
