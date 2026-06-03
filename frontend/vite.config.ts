import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/infraKB/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'InfraKB',
        short_name: 'InfraKB',
        description: 'DevOps Knowledge Base',
        theme_color: '#10b981',
        background_color: '#0d1117',
        display: 'standalone',
        orientation: 'any',
        start_url: '/infraKB/',
        scope: '/infraKB/',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/1243/1243560.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/1243/1243560.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/1243/1243560.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  }
})
