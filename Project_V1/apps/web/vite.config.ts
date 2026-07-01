import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Vite config — exposes `@vexoo/shared` so we can import shared tokens
// directly from .ts source (no separate build step needed in dev).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@vexoo/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@':             path.resolve(__dirname, 'src'),
    },
  },
  server: { port: 5173, host: true },
});
