import { useState } from 'react';
import Typography from '@mui/material/Typography';
// import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';

import { NumberField } from '@base-ui-components/react/number-field';

import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { Component, DataObject } from '@/classes/Component/Component';
import { CircuitLink } from '@/classes/CircuitLink/CircuitLink';

import { modes } from '@/utils/modes';
import { useStore } from '@/utils/store';

import styles from './InspectPanel.module.css';

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
          sx={{ width: 40 }}
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

interface EditNumberProps {
  dataObject: DataObject;
}

function EditNumber(props: EditNumberProps) {
  const [val, setVal] = useState(props.dataObject.value as number);

  const updateNumber = (event: {
    target: {
      value: number;
    };
  }) => {
    setVal(event.target.value);
  };

  return (
    <Box>
      <NumberField.Root defaultValue={12} className={styles.Field}>
        <label className={styles.Label}>{props.dataObject.name}</label>
        <NumberField.Group className={styles.Group}>
          <NumberField.Decrement
            onClick={() => {
              setVal(val - 1);
            }}
            className={styles.Decrement}
          >
            <RemoveIcon />
          </NumberField.Decrement>
          <NumberField.Input
            value={val}
            onChange={updateNumber}
            className={styles.Input}
          />
          <NumberField.Increment
            onClick={() => {
              setVal(val + 1);
            }}
            className={styles.Increment}
          >
            <AddIcon />
          </NumberField.Increment>
        </NumberField.Group>
      </NumberField.Root>
      {/* <TextField
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
        }}
      /> */}
    </Box>
  );
}

interface EditEnumProps {
  dataObject: DataObject;
}

function EditEnum(props: EditEnumProps) {
  const [selectedVal, setSeletedVal] = useState(props.dataObject.value as string);

  const handleChange = (event: SelectChangeEvent) => {
    setSeletedVal(event.target.value as string);
  };

  return (
    <Box>
      <Typography variant="body2">{props.dataObject.name}</Typography>
      <Select value={selectedVal} onChange={handleChange}>
        {props.dataObject.select?.map((enumVal: string, i: number) => (
          <MenuItem key={i} value={enumVal}>
            {enumVal}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

function InspectComponent({ component }: InspectComponentProps) {
  const deleteSelectedComponent = useStore((state) => state.deleteSelectedComponent);

  return (
    // consider creating columns or grid here?
    <Box
      sx={{
        height: '100%',
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ pt: 1 }}>
        <Typography variant="body2"> Type: {component.type} </Typography>
        <Stack sx={{ pt: 1 }} gap={2}>
          {Object.keys(component.data).map((key) => {
            const dataObject = component.data[key];
            if (dataObject.type === 'number') {
              return <EditNumber key={key} dataObject={dataObject} />;
            }
            return <EditEnum key={key} dataObject={dataObject} />;
          })}
        </Stack>
      </Box>

      {/* delete should be at the bottom */}
      <Tooltip title="Delete">
        <IconButton
          sx={{ width: 40 }}
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
