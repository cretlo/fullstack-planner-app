import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: `http://${process.env.VITE_PROXY || "localhost"}:4000`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
