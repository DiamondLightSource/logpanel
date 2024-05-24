import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // proxying any /api calls proxies the call to graylog. Unsure how this would work when deployed
    proxy: {
      '/api': 'https://graylog.diamond.ac.uk',
    },
  },
});
