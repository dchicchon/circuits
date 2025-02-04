// import { useState } from 'react';
import Container from '@mui/material/Container';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Palette from './components/Palette';
import './App.css';
import Wrapper from './components/Wrapper';
import Canvas from './components/Canvas';

const darkTheme = createTheme({
  palette: {
    background: '#fffff',
    mode: 'dark',
  },
});

/**
 *
 *
 * Create a palette like excalidraw to do actions
 *
 *
 */
function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Wrapper>
        <Palette />
        <Canvas />
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
