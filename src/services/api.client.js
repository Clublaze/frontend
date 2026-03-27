import axios from 'axios'
import { config } from '@config/env'

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // ← THIS is the only thing needed for cookies
  // withCredentials: true tells the browser to:
  // 1. Send cookies automatically with every request
  // 2. Accept cookies from the backend in responses
  // The token never touches your JavaScript code at all
})

// ── RESPONSE INTERCEPTOR ─────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response.data,

  (error) => {
    const status = error.response?.status

    if (status === 401) {
      // Cookie expired or invalid — redirect to login
      // No localStorage to clear since token was never stored there
      window.location.href = '/login'
      return Promise.reject({ message: 'Session expired. Please log in again.' })
    }

    if (status === 403) {
      return Promise.reject({
        type: 'FORBIDDEN',
        message: 'You do not have permission to perform this action.',
      })
    }

    return Promise.reject(
      error.response?.data ?? { message: 'Something went wrong. Please try again.' }
    )
  }
)