import { defineConfig } from 'vite';

export default defineConfig({
  // Serve assets from the public/ folder at the root URL
  publicDir: 'public',

  server: {
    port: 3000,
    open: true,
  },

  build: {
    outDir: 'dist',
    // Increase chunk size warning limit — Three.js is large by design
    chunkSizeWarningLimit: 2000,
  },
});
