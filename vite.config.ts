import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base relativa é crucial para GitHub Pages (ex: /meu-repo/)
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  define: {
    // Garante que o código que acessa process.env não quebre no build
    'process.env': {}
  }
});