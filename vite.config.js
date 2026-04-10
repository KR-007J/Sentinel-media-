import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: { 
    outDir: 'dist', 
    sourcemap: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'zustand'],
          charts: ['recharts'],
          motion: ['framer-motion'],
          icons: ['lucide-react']
        }
      }
    }
  },
  base: './'
});
