import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CssBaseline, Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material'
import theme from './theme.jsx'

// Cấu hình react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <CssVarsProvider theme={theme}>
    <CssBaseline />
    <App />
    <ToastContainer position="bottom-left" theme="colored" />
  </CssVarsProvider>
)
