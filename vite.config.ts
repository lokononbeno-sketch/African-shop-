import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' : les liens restent valides sur GitHub Pages (sous-dossier /African-shop-/)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
