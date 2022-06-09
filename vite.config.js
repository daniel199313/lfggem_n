import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api/gem/': {
      //   target: "http://8.214.23.100:8800/"
      // }
    }
  }
});
