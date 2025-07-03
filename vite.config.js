/* eslint-env node */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // 1) Load các biến VITE_* từ .env
  const env = loadEnv(mode, process.cwd());
  // 2) Lấy URL backend từ biến môi trường
  const API_BASE = env.VITE_API_BASE;           // ví dụ "http://localhost:8080"
  // 3) Chuyển http → ws để proxy WebSocket
  const WS_BASE = API_BASE.replace(/^http/, "ws"); // "ws://localhost:8080"

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    define: {
      global: {}, // tránh lỗi thiếu global trong React
    },
    server: {
      port: 5173,       // cố định port dev-server
      strictPort: true, // nếu 5173 đang bận thì báo lỗi luôn
      proxy: {
        // tất cả request bắt đầu /api sẽ proxy về API_BASE
        "/api": {
          target: API_BASE,
          changeOrigin: true,
        },
        // tất cả request WebSocket tới /ws sẽ proxy về WS_BASE
        "/ws": {
          target: WS_BASE,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  };
});