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
    target: "es2020",
    minify: "esbuild",
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          supabase: ["@supabase/supabase-js"],
          charts: ["recharts", "chart.js", "react-chartjs-2"],
        },
      },
    },
  },
});