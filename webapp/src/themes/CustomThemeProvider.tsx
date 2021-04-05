import * as React from 'react';
import {ThemeProvider, useMediaQuery} from "@material-ui/core";
import {useEffect, useState} from "react";
import {getThemeByName} from "./base";

export const CustomThemeContext = React.createContext((themeName: string): void => {});

type Props = {
    children: React.ReactNode
}

const CustomThemeProvider = ({children}: Props) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [themeName, setThemeName] = useState('darkTheme');

    useEffect(() => {
        let theme = localStorage.getItem('theme')
        if (theme) {
            setThemeName(theme)
        } else {
            if (prefersDarkMode) {
                setThemeName('darkTheme')
            } else {
                setThemeName('lightTheme')
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('theme', themeName)
    }, [themeName])

    const theme = getThemeByName(themeName)

    return (
        <CustomThemeContext.Provider value={setThemeName}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </CustomThemeContext.Provider>
    )
}

export default CustomThemeProvider;