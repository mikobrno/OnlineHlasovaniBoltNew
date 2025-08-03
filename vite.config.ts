import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/OnlineHlasovaniBoltNew/',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/email': {
        target: 'https://n8n.srv882016.hstgr.cloud',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api\/email/, '/webhook/ada15a58-b14f-4179-92a1-780b009669a4'),
        secure: true
      }
    }
  },
  preview: {
    port: 3000,
    host: true
  }
})
