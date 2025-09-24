import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración simplificada para build
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: false, // Desactivar minificación para debug
    sourcemap: true
  }
});
