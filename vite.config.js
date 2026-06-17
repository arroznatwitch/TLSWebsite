import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/thelastsurvivor/', // Deploying to GitHub Pages, set the base path to the repository name
})