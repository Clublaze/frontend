import { authClient } from '@services/api.client'

export const authApi = {
  login: (credentials) => authClient.post('/auth/login', credentials),
  register: (data) => authClient.post('/auth/register', data),
  logout: () => authClient.post('/auth/logout'),
  refreshToken: () => authClient.post('/auth/refresh-token'),
  me: () => authClient.get('/auth/me'),
}

export const loginUser = (credentials) => authApi.login(credentials)
export const logoutUser = () => authApi.logout()
