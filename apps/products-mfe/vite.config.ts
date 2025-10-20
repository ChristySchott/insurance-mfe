import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'productsMfe',
      filename: 'remoteEntry.js',
      exposes: {
        './AutoForm': './src/features/auto/AutoForm.tsx',
        './ResidencialForm': './src/features/residencial/ResidencialForm.tsx',
      },
      remotes: {
        multicotadorHost: 'http://localhost:3000/assets/remoteEntry.js',
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
    port: 3001,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 3001,
    strictPort: true,
    cors: true,
  },
})
