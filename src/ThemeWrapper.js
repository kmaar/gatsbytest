import React from 'react'
import { PostiTheme, XyzTheme } from '@postidigital/posti-theme'
import { ThemeProvider } from 'styled-components'

const combinedTheme = { ...PostiTheme, xyz: XyzTheme }

export const ThemeWrapper = ({ children }) => (
  <ThemeProvider theme={combinedTheme}>
    {children}
  </ThemeProvider>
)