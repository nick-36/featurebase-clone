import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
      routeFileIgnorePrefix: "-",
      quoteStyle: "single",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    strictPort: true,
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          react: ["react", "react-dom"],

          // Supabase (API layer)
          supabase: ["@supabase/supabase-js"],

          // TanStack (Heavy, loaded with TypeScript helpers & features)
          tanstack: ["@tanstack/react-query", "@tanstack/react-router"],

          recharts: ["recharts"],
          framer: ["framer-motion"],

          // Radix UI: Big set of composables, mostly needed for forms/dialogs
          radix: [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
          ],

          // UI Libraries
          ui: ["lucide-react", "clsx", "class-variance-authority"],

          // Forms + Validation
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],

          // Utils
          utils: ["uuid", "zustand", "date-fns", "sonner"],
        },
      },
    },
  },
});
