import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@':         path.resolve(__dirname, './src'),
      '@ds':       path.resolve(__dirname, './src/design-system'),
      '@auth':     path.resolve(__dirname, './src/features/auth'),
      '@club':     path.resolve(__dirname, './src/features/club-service'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store':    path.resolve(__dirname, './src/store'),
      '@hooks':    path.resolve(__dirname, './src/hooks'),
      '@utils':    path.resolve(__dirname, './src/utils'),
      '@config':   path.resolve(__dirname, './src/config'),
    },
  },
})