import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import theme from './theme'
import Routes from './routes'

function App () {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    </>
  )
}

export default App
