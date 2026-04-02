import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config: just enable the React plugin (JSX transform, HMR)
export default defineConfig({
  plugins: [react()],
})
