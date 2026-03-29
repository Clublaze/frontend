import axios from 'axios'
import { config } from '@config/env'

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

export const authClient = axios.create({
  baseURL: config.authBaseUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

const addResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => response.data,

    (error) => {
      const status = error.response?.status

      if (status === 401) {
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
}

addResponseInterceptor(apiClient)
addResponseInterceptor(authClient)

export default apiClient