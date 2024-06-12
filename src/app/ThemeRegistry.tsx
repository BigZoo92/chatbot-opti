'use client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {theme} from './theme';
import { Sidebar } from './components/Sidebar';

// This implementation is from emotion-js
// https://github.com/emotion-js/emotion/issues/2928#issuecomment-1319747902
export default function ThemeRegistry(props: any) {
  const { children } = props;

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <Sidebar />

    {children}
  </ThemeProvider>
  );
}