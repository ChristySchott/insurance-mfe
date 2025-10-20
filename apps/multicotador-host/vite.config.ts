import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'multicotador_host',
      remotes: {
        productsMfe: 'http://localhost:3001/assets/remoteEntry.js',
      },
      exposes: {
        './store': './src/store/cotacaoStore.ts',
      },
      shared: [
        'react',
        'react-dom',
        'zustand',
        'react-hook-form',
        '@hookform/resolvers',
        'zod',
      ],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
    cors: true,
  },
})
