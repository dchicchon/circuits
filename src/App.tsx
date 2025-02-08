// import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Palette from './components/Palette';
import './App.css';
import Wrapper from './components/Wrapper';
import Canvas from './components/Canvas';
import Debug from './components/SideMenu';

const darkTheme = createTheme({
  palette: {
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
        <Debug />
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
