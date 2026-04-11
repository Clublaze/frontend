import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const resolvePath = (targetPath) => path.resolve(fileURLToPath(new URL('.', import.meta.url)), targetPath)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@':         resolvePath('./src'),
      '@ds':       resolvePath('./src/design-system'),
      '@auth':     resolvePath('./src/features/auth'),
      '@club':     resolvePath('./src/features/club-service'),
      '@dashboard':resolvePath('./src/features/dashboard'),
      '@services': resolvePath('./src/services'),
      '@store':    resolvePath('./src/store'),
      '@hooks':    resolvePath('./src/hooks'),
      '@utils':    resolvePath('./src/utils'),
      '@config':   resolvePath('./src/config'),
    },
  },
})
