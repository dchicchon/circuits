import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import ComponentsList from '../ComponentList';
import InspectPanel from '../InspectPanel';

const menus = {
  COMPONENTS_LIST: 'COMPONENTS_LIST',
  INSPECT_COMPONENT: 'INSPECT_COMPONENT',
};

function SideMenu() {
  // todo: set this in store instead? to utilize on select
  const [menu, setMenu] = useState(menus.COMPONENTS_LIST);
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
          elevation={menu === menus.COMPONENTS_LIST ? 0 : 5}
          sx={{
            p: 1,
            flex: 1,
            cursor: 'pointer',
            backgroundColor: 'transparent',
          }}
          onClick={() => {
            setMenu(menus.COMPONENTS_LIST);
          }}
        >
          <Typography variant="body1">Components</Typography>
        </Paper>

        <Paper
          elevation={menu === menus.INSPECT_COMPONENT ? 0 : 5}
          sx={{
            p: 1,
            flex: 1,
            cursor: 'pointer',
            backgroundColor: 'transparent',
          }}
          onClick={() => {
            setMenu(menus.INSPECT_COMPONENT);
          }}
        >
          <Typography variant="body1">Inspect</Typography>
        </Paper>
      </Box>
      {menu === menus.COMPONENTS_LIST && <ComponentsList />}
      {menu === menus.INSPECT_COMPONENT && <InspectPanel />}
    </Paper>
  );
}

export default SideMenu;
