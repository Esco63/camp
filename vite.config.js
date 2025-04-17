import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    host: true // Damit dein Handy im WLAN die Seite sehen kann
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        buchung: resolve(__dirname, 'buchung.html'),
        geraete: resolve(__dirname, "geraete.html")
      }
    }
  }
})

