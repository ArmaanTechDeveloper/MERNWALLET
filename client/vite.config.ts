import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const url = process.env.SERVER_URL? process.env.SERVER_URL : 'http://localhost:3000'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': `${url}`
    }
  },
  build: {
    outDir: '../server/public'
  }
})
