import { createSlice } from '@reduxjs/toolkit'

// Load persisted user info from localStorage on app start
// We still persist non-sensitive user info (name, role) so the
// UI doesn't flash blank on refresh while waiting for the backend
const loadAuth = () => {
  try {
    const raw = localStorage.getItem('unihub-user')
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

const saved = loadAuth()

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    // No token here — it lives in the httpOnly cookie, not in JS
    user:           saved.user           ?? null,
    canonicalRole:  saved.canonicalRole  ?? null,
    scopeId:        saved.scopeId        ?? null,
    universityId:   saved.universityId   ?? null,
    universityName: saved.universityName ?? null,
    sessionId:      saved.sessionId      ?? null,
  },
  reducers: {
    setAuth: (state, { payload: d }) => {
      state.user           = d.user
      state.canonicalRole  = d.canonicalRole
      state.scopeId        = d.scopeId
      state.universityId   = d.universityId
      state.universityName = d.universityName
      state.sessionId      = d.sessionId
      // Persist non-sensitive UI info to localStorage
      // so sidebar/role-based UI works immediately on refresh
      localStorage.setItem('unihub-user', JSON.stringify({
        user: d.user, canonicalRole: d.canonicalRole,
        scopeId: d.scopeId, universityId: d.universityId,
        universityName: d.universityName, sessionId: d.sessionId,
      }))
    },
    clearAuth: (state) => {
      state.user           = null
      state.canonicalRole  = null
      state.scopeId        = null
      state.universityId   = null
      state.universityName = null
      state.sessionId      = null
      localStorage.removeItem('unihub-user')
      // Note: the httpOnly cookie is cleared by the backend
      // when you call the logout endpoint
    },
  },
})

export const { setAuth, clearAuth } = authSlice.actions
export const authReducer = authSlice.reducer

// Selectors — no selectToken since the token is not in JS
export const selectUser           = (s) => s.auth.user
export const selectCanonicalRole  = (s) => s.auth.canonicalRole
export const selectScopeId        = (s) => s.auth.scopeId
export const selectUniversityId   = (s) => s.auth.universityId
export const selectUniversityName = (s) => s.auth.universityName
export const selectSessionId      = (s) => s.auth.sessionId
export const selectIsLoggedIn     = (s) => !!s.auth.user // user exists = logged in