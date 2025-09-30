import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  build: {
    outDir: "dist",
  },
  server: {
    host: '0.0.0.0', // Add this
    port: process.env.PORT || 5173 // Add this
  },
  preview: {
    host: '0.0.0.0', // Add this
    port: process.env.PORT || 4173 // Add this
  }
});
