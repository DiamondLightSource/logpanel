import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // server: {
  //   configureServer: ({ middlewares }) => {
  //     middlewares.use((req, res, next) => {
  //       // Set CORS headers
  //       res.setHeader('Access-Control-Allow-Origin', '*');
  //       res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  //       res.setHeader('Access-Control-Allow-Headers', '*');
  //       next();
  // });
  //   }}
})