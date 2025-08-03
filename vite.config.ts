import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  base: mode === 'production' || command === 'build' ? '/OnlineHlasovaniBoltNew/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: false, // Vypneme sourcemap pro produkci
    assetsDir: 'assets',
    target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari12'],
    minify: 'esbuild', // Změna na esbuild
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          pdf: ['jspdf', 'jspdf-autotable'],
          ai: ['@google/generative-ai']
        },
        // Jednodušší názvy souborů
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      // Proxy pro N8N webhook aby obešla CORS
      '/api/email': {
        target: 'https://n8n.srv882016.hstgr.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/email/, '/webhook/ada15a58-b14f-4179-92a1-780b009669a4'),
        secure: true
      }
    }
  },
  preview: {
    port: 3000,
    host: true
  }
}));
