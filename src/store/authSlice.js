import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
  user: null,
  isAuthLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      if (Object.hasOwn(action.payload, 'accessToken')) {
        state.accessToken = action.payload.accessToken;
      }

      if (Object.hasOwn(action.payload, 'user')) {
        state.user = action.payload.user;
      }
    },
    setAuthLoading: (state, action) => {
      state.isAuthLoading = action.payload;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthLoading = false;
    },
  },
});

export const { clearAuth, setAuthLoading, setCredentials } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => !!state.auth.user;
export const selectAuthLoading = (state) => state.auth.isAuthLoading;

export default authSlice.reducer;
