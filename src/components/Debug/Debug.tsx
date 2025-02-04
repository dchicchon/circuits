import { Paper, Stack, Typography } from '@mui/material';
import { useStore } from '@/utils/store';

function Debug() {
  const mode = useStore((state) => state.mode);
  return (
    <Paper
      sx={{
        zIndex: 5,
        p: 2,
        position: 'absolute',
        left: 25,
        top: 25,
        width: 200,
      }}
    >
      <Stack>
        <Typography>Debug Tester</Typography>
        <Typography>Mode: {mode}</Typography>
      </Stack>
    </Paper>
  );
}

export default Debug;
