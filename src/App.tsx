// import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Palette from './components/Palette';
import Wrapper from './components/Wrapper';
import Canvas from './components/Canvas';
import SideMenu from './components/SideMenu';
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Wrapper>
        <Palette />
        <Canvas />
        <SideMenu />
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
