import { resolve } from 'path'
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup/popup.html'),
      },
    },
    outDir: 'build',
  },
  publicDir: 'static',
})
