import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/cli.ts", "**/*.d.ts", "**/*.config.*"],
      reporter: ["text", "text-summary", "html"],
      reportsDirectory: "./coverage",
    },
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
