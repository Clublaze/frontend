import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
  user: null,
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
    clearAuth: () => initialState,
  },
});

export const { clearAuth, setCredentials } = authSlice.actions;
export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
