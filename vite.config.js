import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "terser",
    chunkSizeWarningLimit: 1600,
  },
  define: {
    __VUE_PROD_DEVTOOLS__: false,
  },
});
