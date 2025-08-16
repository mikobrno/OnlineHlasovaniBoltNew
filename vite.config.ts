import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/OnlineHlasovaniBoltNew/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      // VLOŽILI JSME TUTO NOVOU SEKCI "INPUT"
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        format: 'es',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    },
    assetsDir: 'assets',
    target: 'es2015',
    minify: 'terser',
    sourcemap: false
  },
  server: {
    port: 3000,
    host: true,
    hmr: {
      clientPort: 3000
    },
    cors: {
      origin: '*',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true
    },
    proxy: {
      '/api/email': {
        target: 'https://n8n.srv882016.hstgr.cloud',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api\/email/, '/webhook/ada15a58-b14f-4179-92a1-780b009669a4'),
        secure: true
      },
      '/v1': {
        target: process.env.VITE_NHOST_BACKEND_URL,
        changeOrigin: true,
        ws: true
      }
    }
  },
  preview: {
    port: 3000,
    host: true
  }
})