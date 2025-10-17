import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      outDir: 'dist',
      staticImport: true,
      insertTypesEntry: true,
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'PrimeVueFormValidator',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'primevue', 'async-validator'],
      output: {
        globals: {
          vue: 'Vue',
          primevue: 'PrimeVue',
          'async-validator': 'AsyncValidator'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})