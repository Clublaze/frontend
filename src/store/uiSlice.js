import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    toasts: [],  // [{ id, message, type: 'success'|'error'|'info'|'warning' }]
  },
  reducers: {
    toggleSidebar:  (s)             => { s.sidebarOpen = !s.sidebarOpen },
    setSidebarOpen: (s, { payload })=> { s.sidebarOpen = payload },
    addToast:       (s, { payload })=> { s.toasts.push({ id: Date.now(), ...payload }) },
    removeToast:    (s, { payload })=> { s.toasts = s.toasts.filter(t => t.id !== payload) },
  },
})

export const { toggleSidebar, setSidebarOpen, addToast, removeToast } = uiSlice.actions
export const uiReducer = uiSlice.reducer

export const selectSidebarOpen = (s) => s.ui.sidebarOpen
export const selectToasts      = (s) => s.ui.toasts