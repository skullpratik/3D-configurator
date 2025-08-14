import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.', // Looks for index.html in root
  publicDir: 'public', // Your other static files
  plugins: [react()],
  server: {
    port: 3000
  }
})