import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { Component } from '@/classes/Component/Component';
import { CircuitLink } from '@/classes/CircuitLink/CircuitLink';

import { modes } from '@/utils/modes';
import { useStore } from '@/utils/store';

function InspectMultimeter() {
  return (
    // consider creating columns or grid here?
    <Box sx={{ p: 1 }}>
      <Typography variant="body2"> Multimeter </Typography>
      <Typography variant="body2"> Anode: set </Typography>
      <Typography variant="body2"> Cathode: set </Typography>
      {/* TODO: Show data for the selected component */}
    </Box>
  );
}

interface InspectLinkProps {
  link: CircuitLink;
}

function InspectLink({ link }: InspectLinkProps) {
  // todo: maybe i dont need to do this? idk
  const deleteSelectedComponent = useStore((state) => state.deleteSelectedComponent);
  return (
    // consider creating columns or grid here?
    <Box sx={{ p: 1 }}>
      <Typography variant="body2"> Type: {link.type} </Typography>
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
    </Box>
  );
}

// should be able to modify the voltage of the battery
interface InspectComponentProps {
  component: Component;
}

function InspectComponent({ component }: InspectComponentProps) {
  const deleteSelectedComponent = useStore((state) => state.deleteSelectedComponent);

  return (
    // consider creating columns or grid here?
    <Box sx={{ p: 1 }}>
      <Typography variant="body2"> Type: {component.type} </Typography>
      {Object.keys(component.data).map((key) => {
        const val = component.data[key];
        return (
          <div key={key}>
            {key}: {val}
          </div>
        );
      })}
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
    </Box>
  );
}

function InspectPanel() {
  const selected = useStore((state) => state.selected);
  const mode = useStore((state) => state.mode);

  if (selected instanceof Component) {
    return <InspectComponent component={selected} />;
  } else if (selected instanceof CircuitLink) {
    return <InspectLink link={selected} />;
  } else if (mode === modes.Multimeter) {
    return <InspectMultimeter />;
  }

  return (
    <Typography sx={{ p: 1 }} variant="body1">
      No Selected Component
    </Typography>
  );
}

export default InspectPanel;
