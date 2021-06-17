import * as React from 'react';
import {
  PaletteMode,
  ThemeProvider as MuiThemeProvider,
  useMediaQuery
} from "@material-ui/core"
import createTheme from "@material-ui/core/styles/createTheme"
import darkScrollbar from '@material-ui/core/darkScrollbar';
import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {getCookie} from "../utils/helpers";
import {lightTheme} from "./light";
import Background from "../images/wallpaper_oblivion.jpg";

type ThemeContext = {
  setTheme: (theme: 'dark' | 'light') => void
}

export const ThemeContext = createContext<ThemeContext>({} as ThemeContext)
ThemeContext.displayName = 'ThemeContext'

type Props = {
  children: React.ReactNode
}

export const ThemeProvider = (props: Props) => {
  const { children } = props

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const preferredMode = prefersDarkMode ? 'dark' : 'light'
  const [paletteMode, setPaletteMode] = useState(preferredMode)

  useEffect(() => {
    const nextPaletteMode = getCookie('paletteMode') || preferredMode
    setPaletteMode(nextPaletteMode)
  }, [preferredMode])

  const theme = useMemo(() => {
    const nextTheme = createTheme({
      palette: {
        primary: {
          main: paletteMode === 'light' ? '#00373E' : '#00a2bc',
        },
        secondary: {
          main: '#9BC635',
        },
        mode: paletteMode as PaletteMode,
      },
      components: {
        MuiListItem: {
          styleOverrides: {
            root: {
              '&:hover': {
                backgroundColor: '#9BC635',
              },
            }
          }
        },
      },
    })

    nextTheme.components = {
      MuiButton: {
        styleOverrides: {
          contained: {
            padding: 8,
            textTransform: 'none',
            borderRadius: 10,
          },
          containedPrimary: {
            border: `2px solid ${nextTheme.palette.primary.dark}`,
            '&:hover': {
              backgroundColor: `${nextTheme.palette.primary.dark}`,
            },
          },
          containedSecondary: {
            border: `2px solid ${nextTheme.palette.secondary.dark}`,
            '&:hover': {
              backgroundColor: `${nextTheme.palette.secondary.dark}`,
            },
          },
        }
      }
    }

    return nextTheme
  }, [paletteMode])

  const setTheme = (theme: 'light' | 'dark') => {
    setPaletteMode(theme)
    console.log(theme)
  }

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeContext.Provider value={{setTheme}}>{children}</ThemeContext.Provider>
    </MuiThemeProvider>
  )
}

export function useChangeTheme() {
  const theme = useContext(ThemeContext)
  return theme.setTheme
}