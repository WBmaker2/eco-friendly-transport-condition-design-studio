import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const repositoryBase = "/eco-friendly-transport-condition-design-studio/";

export default defineConfig({
  root: "pages",
  base: repositoryBase,
  publicDir: "../public",
  plugins: [react()],
  build: {
    outDir: "../dist-pages",
    emptyOutDir: true,
  },
});
