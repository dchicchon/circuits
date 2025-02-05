import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PolylineIcon from '@mui/icons-material/Polyline';
import BackHandIcon from '@mui/icons-material/BackHand';
// import FiberSmartRecordIcon from '@mui/icons-material/FiberSmartRecord';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStore } from '../../utils/store';
import { modes } from '../../utils/modes';
// import { modes } from '@/utils/modes';
// import { useStore } from '@/utils/store';

function Palette() {
  // const successMessage = useStore((state) => state.successMessage);
  // const errorMessage = useStore((state) => state.errorMessage);
  const setMode = useStore((state) => state.setMode);
  const mode = useStore((state) => state.mode);
  const deleteNode = useStore((state) => state.deleteNode);

  return (
    <Box
      sx={{
        // border: '1px solid white',
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
      <Paper elevation={5}>
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
        </Stack>
      </Paper>
    </Box>
  );
}

export default Palette;
