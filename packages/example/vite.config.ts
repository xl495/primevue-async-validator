import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@primevue-form/validator': path.resolve(__dirname, '../form-validator/src')
    }
  },
  server: {
    port: 3001,
    open: true
  }
})