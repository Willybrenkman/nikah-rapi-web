// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        // Jangan cache halaman protected
        navigateFallbackDenylist: [/^\/dashboard/, /^\/onboarding/],
      },
      manifest: {
        name: 'Nikah Rapi Planner',
        short_name: 'Nikah Rapi',
        description: 'Buku perencana pernikahan terpadu impianmu',
        theme_color: '#FDFAF6',
        background_color: '#FDFAF6',
        display: 'standalone',
        orientation: 'portrait'
      }
    })
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    target: "es2015",
    minify: "esbuild",
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('recharts') || id.includes('chart.js') || id.includes('d3')) return 'charts';
          if (id.includes('sweetalert')) return 'sweetalert';
          if (id.includes('react-helmet-async') || id.includes('react-hot-toast')) return 'ui-vendor';
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/react-router') ||
            id.includes('/node_modules/scheduler/')
          ) return 'react-vendor';
          return 'vendor';
        },
      },
    },
  },
});