import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "@chakra-ui/react",
      "@chakra-ui/icons",
      "@emotion/react",
      "@emotion/styled",
      "framer-motion",
    ],
  },
  server: {
    proxy: {
      // When frontend requests /api -> send it to Node.js backend
      "/api": {
        target: "http://localhost:8000", // your Node.js backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
