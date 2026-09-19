import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local/default: '/'. GitHub Pages project site: VITE_BASE=/french-wine-regions/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
})
