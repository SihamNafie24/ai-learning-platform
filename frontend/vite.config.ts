import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 3000,
    open: true,
    fs: {
      strict: true,
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: 'esbuild',
  },
  preview: {
    port: 3000,
  },
  optimizeDeps: {
    include: [
      '@tanstack/react-router',
      '@tanstack/react-router-devtools',
      'react',
      'react-dom',
      'react-hook-form',
    ],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
