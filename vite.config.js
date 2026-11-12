import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isGitHubPages = process.env.VITE_GITHUB_PAGES === "true";

export default defineConfig({
  root: "client",
  plugins: [react()],
  base: isGitHubPages ? "/nova-pc/" : "/app/",
  publicDir: "public",
  build: { outDir: "../public/app", emptyOutDir: true },
});
