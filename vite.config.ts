import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const base = process.env.BASE_PATH || '/golf/';
export default defineConfig({
  base,
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    includeAssets: ['icons/*.png', 'favicon.svg'],
    manifest: {
      id: base, name: 'はじめてゴルフ', short_name: 'はじめてゴルフ', lang: 'ja',
      description: 'イラストで学ぶ、初心者のためのゴルフ練習帳',
      theme_color: '#174e3c', background_color: '#f6f7f2',
      display: 'standalone', start_url: base, scope: base,
      icons: [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: 'icons/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }],
    },
    workbox: {
      cacheId: 'hajimete-golf',
      globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
      navigateFallback: 'index.html',
      navigateFallbackAllowlist: [new RegExp(`^${base}`)],
      cleanupOutdatedCaches: true,
    },
  })],
});
