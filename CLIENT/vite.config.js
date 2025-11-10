import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // your frontend port
    proxy: {
      '/api/v1': {
        target: 'http://localhost:4000', // your backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
