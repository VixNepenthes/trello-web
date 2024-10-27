import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CssBaseline, Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material'
import theme from './theme.jsx'

// Cấu hình react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Cấu hình MUI dialog
import { ConfirmProvider } from 'material-ui-confirm'
import { Provider } from 'react-redux'
import { store } from '~/redux/store.js'

// config react-router-dom with BrowserRouter
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/">
    <Provider store={store}>
      <CssVarsProvider theme={theme}>
        <ConfirmProvider
          defaultOptions={{
            buttonOrder: ['confirm', 'cancel'],

            allowClose: false,
            dialogProps: {
              maxWidth: 'xs'
            },
            confirmationButtonProps: {
              color: 'secondary',
              variant: 'outlined'
            },
            cancellationButtonProps: {
              color: 'inherit'
            }
          }}>
          <CssBaseline />
          <App />
          <ToastContainer position="bottom-left" theme="colored" />
        </ConfirmProvider>
      </CssVarsProvider>
    </Provider>
  </BrowserRouter>
)
