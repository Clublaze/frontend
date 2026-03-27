import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './authSlice'
import { uiReducer }   from './uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,  // state.auth.*
    ui:   uiReducer,    // state.ui.*
  },
})