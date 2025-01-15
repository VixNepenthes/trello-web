import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CssBaseline, Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material'
import GlobalStyles from '@mui/material/GlobalStyles'
import theme from './theme.jsx'

// Cấu hình react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Cấu hình MUI dialog
import { ConfirmProvider } from 'material-ui-confirm'
import { Provider } from 'react-redux'
import { store } from '~/redux/store.js'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
const persistor = persistStore(store)

// config react-router-dom with BrowserRouter
import { BrowserRouter } from 'react-router-dom'

import { injectStore } from './utils/authorizedAxios.js'
injectStore(store)



ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename="/">
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
            <GlobalStyles styles={{ a: { textDecoration: 'none' } }} />
            <CssBaseline />
            <App />
            <ToastContainer position="bottom-left" theme="colored" />
          </ConfirmProvider>
        </CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
