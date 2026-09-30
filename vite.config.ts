import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Project Pages: https://dhythm.github.io/mock-gallery/
export default defineConfig({
  base: "/mock-gallery/",
  plugins: [react()],
});
