import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import ComponentsList from '../ComponentList';
import InspectPanel from '../InspectPanel';

function SideMenu() {
  // todo: set this in store instead? to utilize on select
  const [menu, setMenu] = useState('components-list');
  return (
    <Paper
      elevation={5}
      sx={{
        display: 'flex',
        flexDirection: 'column',
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
      {menu === 'components-list' && <ComponentsList />}
      {menu === 'inspect-component' && <InspectPanel />}
    </Paper>
  );
}

export default SideMenu;
