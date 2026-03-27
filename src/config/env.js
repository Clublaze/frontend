export const config = {
  apiBaseUrl:  import.meta.env.VITE_API_BASE_URL  ?? 'http://localhost:3001/api/v1',
  authBaseUrl: import.meta.env.VITE_AUTH_BASE_URL ?? 'http://localhost:3000/api/v1',
  s3BaseUrl:   import.meta.env.VITE_S3_BASE_URL   ?? '',
  isDev:       import.meta.env.DEV,
  isProd:      import.meta.env.PROD,
}