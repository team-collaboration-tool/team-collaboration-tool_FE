import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  proxy: {
    "/api": {
      target: "http://hyupmin.ap-northeast-2.elasticbeanstalk.com",
      changeOrigin: true,
    },
  },
});
