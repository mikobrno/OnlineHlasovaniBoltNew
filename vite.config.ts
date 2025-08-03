import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          pdf: ['jspdf', 'jspdf-autotable'],
          ai: ['@google/generative-ai']
        }
      }
    }
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
});
