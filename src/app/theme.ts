import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    body1: {
      color: '#ffffff',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          '& .MuiInputBase-input': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        },
      },
    },
  },
});
