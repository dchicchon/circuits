import React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useStore } from '../../utils/store';

interface WrapperProps {
  children: React.ReactNode;
}

// include a snackbar message portion to show errors and whatnot

function Wrapper(props: WrapperProps) {
  const openBar = useStore((state) => state.openBar);
  const message = useStore((state) => state.message);
  const severity = useStore((state) => state.severity);
  const closeMessage = useStore((state) => state.closeMessage);

  const handleClose = (_: unknown, reason?: SnackbarCloseReason) => {
    if (reason == 'clickaway') {
      return;
    }
    closeMessage();
  };

  return (
    <>
      {props.children}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={openBar}
        autoHideDuration={6000}
        onClose={handleClose}
        // action={action}
      >
        <Alert severity={severity}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>{message}</Typography>
            <IconButton
              color="inherit"
              aria-label="close"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Alert>
      </Snackbar>
    </>
  );
}

export default Wrapper;
