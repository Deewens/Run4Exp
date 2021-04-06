import {createMuiTheme} from "@material-ui/core";

export const darkTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#00373E',
    },
    secondary: {
      main: '#9BC635',
    },
    background: {
      darker: '#181818',
      darkGreen: '#00373E',
    },
    mode: 'dark'
  },
})

darkTheme.components = {
  MuiButton: {
    styleOverrides: {
      contained: {
        padding: 8,
        textTransform: 'none',
        borderRadius: 10,
      },
      containedPrimary: {
        border: `2px solid ${darkTheme.palette.primary.dark}`,
        '&:hover': {
          backgroundColor: `${darkTheme.palette.primary.dark}`,
        },
      },
      containedSecondary: {
        border: `2px solid ${darkTheme.palette.secondary.dark}`,
        '&:hover': {
          backgroundColor: `${darkTheme.palette.secondary.dark}`,
        },
      },
    }
  }
}