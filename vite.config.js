/* eslint-env node */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const API_BASE = env.VITE_API_BASE;
  const WS_BASE = API_BASE.replace(/^http/, "ws");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    define: {
      global: {},
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": {
          target: API_BASE,
          changeOrigin: true,
        },
        "/ws": {
          target: WS_BASE,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  };
});