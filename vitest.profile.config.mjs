import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  esbuild: { jsx: "automatic" },
  test: {
    environment: "jsdom",
    environmentOptions: { jsdom: { pretendToBeVisual: true, url: "https://requote.invalid" } },
    include: ["tests/profile-ui.test.tsx"],
    maxWorkers: 1,
    minWorkers: 1,
  },
});
