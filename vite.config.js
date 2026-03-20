import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path" // <-- YEH ADD KAR

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // <-- AUR YEH ADD KAR
    },
  },
})