import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/cli.ts"],
  clean: true,
  dts: true,
  format: ["esm"],
  sourcemap: true,
  splitting: false,
  target: "node20",
  outDir: "dist",
});
