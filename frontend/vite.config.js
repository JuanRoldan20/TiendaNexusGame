import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// http://localhost:5173 (el api-gateway ya permite este origen por CORS)
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
