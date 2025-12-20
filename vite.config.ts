import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // For GitHub Pages, set base to '/repository-name/'
  // For custom domain or root, set base to '/'
  base: '/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  }
});
