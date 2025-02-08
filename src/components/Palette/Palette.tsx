import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PolylineIcon from '@mui/icons-material/Polyline';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import BackHandIcon from '@mui/icons-material/BackHand';

import { useStore } from '../../utils/store';
import { modes } from '../../utils/modes';

function Palette() {
  const setMode = useStore((state) => state.setMode);
  const mode = useStore((state) => state.mode);

  return (
    <Box
      sx={{
        borderRadius: 2,
        position: 'absolute',
        top: 75,
        left: 0,
        right: 0,
        width: 300,
        marginRight: 'auto',
        marginLeft: 'auto',
        zIndex: 2,
      }}
    >
      <Paper sx={{ p: 0.5 }} elevation={5}>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Select">
            <IconButton
              onClick={() => {
                setMode(modes.SELECT);
              }}
              aria-label={modes.SELECT}
            >
              <BackHandIcon color={mode === modes.SELECT ? 'primary' : 'inherit'} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Connect Circuit Node">
            <IconButton
              onClick={() => {
                setMode(modes.CONNECT_CIRCUIT_NODE);
              }}
              aria-label={modes.CONNECT_CIRCUIT_NODE}
            >
              <PolylineIcon
                color={mode === modes.CONNECT_CIRCUIT_NODE ? 'primary' : 'inherit'}
              />
            </IconButton>
          </Tooltip>
          {/* use multimeter across links */}
          <Tooltip title="Multimeter">
            <IconButton
              onClick={() => {
                setMode(modes.MULTMETER);
              }}
              aria-label={modes.MULTMETER}
            >
              <QueryStatsIcon color={mode === modes.MULTMETER ? 'primary' : 'inherit'} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Palette;
