import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        buchung: resolve(__dirname, 'buchung.html'),
        geraete: resolve(__dirname, "geraete.html")  // <== das hier ist wichtig
      }
    }
  }
})
