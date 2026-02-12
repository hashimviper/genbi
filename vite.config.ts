import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["visorybi-icon-192.png", "visorybi-icon-512.png", "apple-touch-icon.png"],
      workbox: {
        maximumFileSizeToCacheInBytes: 5000000,
      },
      manifest: {
        name: "VisoryBI",
        short_name: "VisoryBI",
        description: "Business Intelligence Dashboard Builder",
        theme_color: "#2563eb",
        background_color: "#f8fafc",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/visorybi-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/visorybi-icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/visorybi-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          charts: ["recharts"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-popover", "@radix-ui/react-tabs", "@radix-ui/react-select"],
          icons: ["lucide-react"],
        },
      },
    },
  },
}));
