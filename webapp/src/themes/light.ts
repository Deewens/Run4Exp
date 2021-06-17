import {createMuiTheme, darken} from "@material-ui/core";
import {blue, red} from "@material-ui/core/colors";

export const lightTheme = createMuiTheme({
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#9BC635',
          },
        }
      }
    }
  },
  palette: {
    primary: {
      main: '#00373E',
    },
    secondary: {
      main: '#9BC635',
    },
    background: {
      darker: darken('#fff', 10),
      darkGreen: '#00373E',
    },
    mode: 'light',
  }
})

lightTheme.components = {
  MuiButton: {
    styleOverrides: {
      contained: {
        padding: 8,
        textTransform: 'none',
        borderRadius: 10,
      },
      containedPrimary: {
        border: `2px solid ${lightTheme.palette.primary.dark}`,
        '&:hover': {
          backgroundColor: `${lightTheme.palette.primary.dark}`,
        },
      },
      containedSecondary: {
        border: `2px solid ${lightTheme.palette.secondary.dark}`,
        '&:hover': {
          backgroundColor: `${lightTheme.palette.secondary.dark}`,
        },
      },
    }
  }
}