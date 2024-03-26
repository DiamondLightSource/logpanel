import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    typography: {},
    palette: {
        background: {
          paper: '#fff',
        },
        text: {
          primary: '#173A5E',
          secondary: '#46505A',
        },
        action: {
          active: '#001E3C',
        },
        success: {
          main: '#009688',
        },
        primary: {
          main: '#173A5E'
        }
      },
});