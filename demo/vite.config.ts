import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@lezer/markdown': path.resolve(__dirname, '../lezer-markdown-delimiterResolvers/dist/index.js'),
      '@lezer/highlight': path.resolve(__dirname, 'node_modules/@lezer/highlight'),
      '@lezer/common': path.resolve(__dirname, 'node_modules/@lezer/common'),
      '@partial-emphasis/extension': path.resolve(__dirname, '../extension/partial-emphases.ts')
    }
  }
})
